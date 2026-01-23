// backend/controllers/userController.js

const User = require("../models/User");
const asyncHandler = require("express-async-handler");
const admin = require("../firebaseAdmin");

// 🔹 ユーザー新規登録（Firebase認証済みのユーザーをMongoDBに登録）
const registerUser = asyncHandler(async (req, res) => {

  const { uid, email, displayName } = req.body;

  if (!uid || !email) {
    return res.status(400).json({ message: "必須情報が不足しています。" });
  }

  const existingUser = await User.findOne({ uid: uid });
  if (existingUser) {
    return res
      .status(200)
      .json({ message: "既に登録済み", user: existingUser });
  }

  const newUser = new User({
    uid,
    displayName,
    email,
    role: "user",
  });

  const savedUser = await newUser.save();

  res.status(201).json({ message: "登録完了", user: savedUser });
});

// 🔸 ユーザー情報の取得（自身）
const getMe = asyncHandler(async (req, res) => {
  const { uid } = req.user;
  const user = await User.findOne({ uid: uid });

  if (!user) {
    return res.status(404).json({ message: "ユーザーが見つかりません" });
  }

  res.status(200).json({ user });
});

// 🔸 ユーザー情報の更新（自身）
const updateUser = asyncHandler(async (req, res) => {
  const { uid } = req.user;
  const updates = req.body;
  const updatedUser = await User.findOneAndUpdate({ uid: uid }, updates, {
    new: true,
  });

  if (!updatedUser) {
    return res.status(404).json({ message: "ユーザーが見つかりません" });
  }

  res.status(200).json({ message: "更新完了", user: updatedUser });
});

// 🔸 ユーザー削除（自身）
const deleteUser = asyncHandler(async (req, res) => {
  const { uid } = req.user;
  const deletedUser = await User.findOneAndDelete({ uid: uid });

  if (!deletedUser) {
    return res.status(404).json({ message: "ユーザーが見つかりません" });
  }

  res.status(200).json({ message: "ユーザー削除完了" });
});

// ✅ 複数の特定のユーザー情報を取得する関数
const getUsers = asyncHandler(async (req, res) => {
  const ids = req.query.ids ? req.query.ids.split(",") : [];
  if (ids.length === 0) {
    return res.json([]);
  }
  const users = await User.find({ uid: { $in: ids } });

  const formattedUsers = users.map((user) => ({
    uid: user.uid,
    displayName: user.displayName,
    email: user.email,
  }));

  res.json(formattedUsers);
});

// ✅ 管理者専用：すべてのユーザーを取得するコントローラー（検索対応）
const getAllUsers = asyncHandler(async (req, res) => {
  const { search } = req.query;
  const query = {};

  if (search) {
    query.$or = [
      { email: { $regex: search, $options: "i" } },
      { displayName: { $regex: search, $options: "i" } },
    ];
  }

  const users = await User.find(query).select("-password");
  if (!users) {
    return res.status(404).json({ message: "ユーザーが見つかりません。" });
  }

  const usersWithFirebaseInfo = await Promise.all(
    users.map(async (user) => {
      try {
        const firebaseUser = await admin.auth().getUser(user.uid);
        return {
          ...user.toObject(),
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          disabled: firebaseUser.disabled,
        };
      } catch (error) {
        console.error(`Firebaseユーザー取得エラー (UID: ${user.uid}):`, error);
        return { ...user.toObject(), disabled: true, firebaseError: true };
      }
    })
  );

  res.status(200).json({ users: usersWithFirebaseInfo });
});

// 🔹 認証ユーザー向け：必要最低限の情報のみ返す安全なユーザー一覧取得
const getUsersBasic = asyncHandler(async (req, res) => {
  const users = await User.find({}).select("uid displayName role");
  if (users) {
    res.status(200).json({ users });
  } else {
    res.status(404).json({ message: "ユーザーが見つかりません。" });
  }
});

// ✅ 修正済み：ユーザーの役割を更新（MongoDB + Firebase Custom Claims 両方）
const updateUserRole = asyncHandler(async (req, res) => {
  const { id } = req.params; // uid
  const { role } = req.body;

  if (!["admin", "user"].includes(role)) {
    res.status(400);
    throw new Error(
      "無効な役割です。'admin' または 'user' を指定してください。"
    );
  }

  try {
    await admin.auth().setCustomUserClaims(id, { role });

    const updatedFirebaseUser = await admin.auth().getUser(id);

    const user = await User.findOneAndUpdate(
      { uid: id },
      { role },
      { new: true }
    );

    if (!user) {
      res.status(404);
      throw new Error("MongoDBにユーザーが見つかりません。");
    }

    res.status(200).json({
      message: `役割を ${role} に更新しました（Firebase Claims & MongoDB）`,
      user,
    });
  } catch (error) {
    console.error("[updateUserRole] エラー:", error.code || error.message);
    res.status(500);
    throw new Error(`役割更新に失敗しました: ${error.message}`);
  }
});

// ✅ ユーザーの有効化/無効化を切り替える関数
const toggleUserDisabledStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { disabled } = req.body;

  if (!id || typeof disabled !== "boolean") {
    return res.status(400).json({
      message:
        "ユーザーID(Firebase UID)と無効化ステータス(disabled: boolean)が必要です。",
    });
  }

  try {
    await admin.auth().updateUser(id, { disabled: disabled });
    console.log(
      `[toggleUserDisabledStatus] アカウント${
        disabled ? "無効化" : "有効化"
      }成功: UID=${id}`
    );

    res.status(200).json({
      message: `ユーザーアカウントは正常に${
        disabled ? "無効化" : "有効化"
      }されました。`,
    });
  } catch (error) {
    console.error("[toggleUserDisabledStatus] エラー:", error);
    res
      .status(500)
      .json({
        message: "ユーザーの有効化/無効化に失敗しました。",
        error: error.message,
      });
  }
});

// ✅ 特定のユーザー情報を取得する関数
const getUserById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const user = await User.findOne({ uid: id }).select("-password");

  if (!user) {
    res.status(404);
    throw new Error("ユーザーが見つかりません。");
  }

  try {
    const firebaseUser = await admin.auth().getUser(id);

    const userWithFirebaseInfo = {
      ...user.toObject(),
      uid: firebaseUser.uid,
      disabled: firebaseUser.disabled,
    };

    res.status(200).json({ user: userWithFirebaseInfo });
  } catch (error) {
    console.error("Firebaseユーザー情報の取得に失敗しました:", error);
    res.status(500);
    throw new Error("ユーザー情報の取得に失敗しました。");
  }
});

module.exports = {
  registerUser,
  getMe,
  updateUser,
  deleteUser,
  getUsers,
  getAllUsers,
  getUsersBasic,
  updateUserRole,
  toggleUserDisabledStatus,
  getUserById,
};
