// backend/controllers/contactController.js

const Contact = require("../models/contactModel");
const mongoose = require("mongoose");

// 📄 問い合わせ一覧取得
exports.getContacts = async (req, res) => {
  try {
    const filter = {};
    const isAdmin = req.user && req.user.role === "admin";

    // 顧客IDがクエリパラメータに含まれている場合は、その顧客に紐づく問い合わせのみを返す
    if (req.query.customerId) {
      if (!mongoose.Types.ObjectId.isValid(req.query.customerId)) {
        return res.status(400).json({ error: "無効な顧客IDです" });
      }
      filter.customerId = req.query.customerId;
    } else if (!isAdmin) {
      // Adminユーザーではない場合、ログインユーザーに割り当てられた問い合わせのみを返す
      if (req.user && req.user.uid) {
        filter.assignedUserId = req.user.uid;
      } else {
        // ログインしていない場合は何も返さない
        return res.json([]);
      }
    }

    const contacts = await Contact.find(filter).sort({ createdAt: -1 });
    res.json(contacts);
  } catch (err) {
    console.error("❌ 問い合わせ一覧取得エラー:", err);
    res.status(500).json({ error: "問い合わせ一覧の取得に失敗しました" });
  }
};

// ➕ 問い合わせを新規作成
exports.createContact = async (req, res) => {
  try {
    const {
      customerId,
      customerName,
      contactName,
      contactEmail,
      content,
      contactPhone,
      responseStatus,
    } = req.body;

    if (!contactName || !content) {
      return res.status(400).json({ error: "氏名・内容は必須です" });
    }

    // ログインユーザーの場合、assignedUserIdを設定
    const assignedUserId = req.user ? req.user.uid : null;

    const newContact = new Contact({
      customerId: customerId || null,
      customerName,
      contactName,
      contactEmail,
      contactPhone: contactPhone || "",
      content,
      responseStatus: responseStatus || "未対応", // ✅ 修正: リクエストからステータスを取得、なければ"未対応"
      assignedUserId,
    });

    const saved = await newContact.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error("❌ 問い合わせ作成エラー:", err);
    res.status(400).json({ error: "問い合わせの作成に失敗しました" });
  }
};

// ✏️ 問い合わせを更新
exports.updateContact = async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);
    if (!contact) {
      return res.status(404).json({ error: "問い合わせが見つかりません" });
    }

    const isAdmin = req.user && req.user.role === "admin";

    // 一般社員は自分担当のものだけ編集可能
    if (!isAdmin && contact.assignedUserId !== req.user.uid) {
      return res.status(403).json({ error: "権限がありません" });
    }

    const {
      customerId,
      customerName,
      contactName,
      contactEmail,
      content,
      contactPhone,
      responseStatus,
      memo,
      assignedUserId, // ← 追加
    } = req.body;

    if (!contactName || !content) {
      return res.status(400).json({ error: "氏名・内容は必須です" });
    }

    contact.customerId = customerId || contact.customerId;
    contact.customerName = customerName || contact.customerName;
    contact.contactName = contactName;
    contact.contactEmail = contactEmail;
    contact.content = content;
    contact.contactPhone = contactPhone || "";
    contact.responseStatus = responseStatus || contact.responseStatus;
    contact.memo = memo || contact.memo;

    // 🚨 担当者変更は Admin のみ許可
    if (isAdmin && assignedUserId) {
      contact.assignedUserId = assignedUserId;
    }

    const updated = await contact.save();
    res.json(updated);
  } catch (err) {
    console.error("❌ 問い合わせ更新エラー:", err);
    res.status(400).json({ error: "問い合わせの更新に失敗しました" });
  }
};

// 🗑️ 問い合わせを削除
exports.deleteContact = async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);
    if (!contact) {
      return res.status(404).json({ error: "問い合わせが見つかりません" });
    }

    const isAdmin = req.user && req.user.role === "admin";
    if (
      !isAdmin &&
      contact.assignedUserId &&
      contact.assignedUserId !== req.user.uid
    ) {
      return res.status(403).json({ error: "権限がありません" });
    }

    await Contact.findByIdAndDelete(req.params.id);
    res.json({ message: "問い合わせを削除しました" });
  } catch (err) {
    console.error("❌ 問い合わせ削除エラー:", err);
    res.status(500).json({ error: "問い合わせの削除に失敗しました" });
  }
};
