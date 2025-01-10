const Message = require("../models/Message");
const Appointment = require("../models/Appointment");

class MessageController {
  // 发送消息
  async sendMessage(req, res) {
    try {
      const { receiverId, content, appointmentId } = req.body;
      const senderId = req.user._id;

      // 验证预约存在且用户有权限发送消息
      if (appointmentId) {
        const appointment = await Appointment.findById(appointmentId);
        if (!appointment) {
          return res.status(404).json({ error: "预约不存在" });
        }

        // 检查发送者是否是预约的参与者
        if (
          appointment.userId.toString() !== senderId.toString() &&
          appointment.expertId.toString() !== senderId.toString()
        ) {
          return res.status(403).json({ error: "无权发送消息" });
        }
      }

      const message = new Message({
        sender: senderId,
        receiver: receiverId,
        content,
        appointmentId,
      });

      await message.save();

      // 返回保存的消息，并填充发送者信息
      const populatedMessage = await Message.findById(message._id)
        .populate("sender", "name email")
        .populate("receiver", "name email");

      res.status(201).json(populatedMessage);
    } catch (error) {
      console.error("发送消息错误:", error);
      res.status(500).json({ error: "发送消息失败" });
    }
  }

  // 获取与特定用户的聊天历史
  async getChatHistory(req, res) {
    try {
      const { userId } = req.params;
      const currentUserId = req.user._id;

      const messages = await Message.find({
        $or: [
          { sender: currentUserId, receiver: userId },
          { sender: userId, receiver: currentUserId },
        ],
      })
        .sort({ timestamp: 1 })
        .populate("sender", "name email")
        .populate("receiver", "name email");

      res.json(messages);
    } catch (error) {
      console.error("获取聊天历史错误:", error);
      res.status(500).json({ error: "获取聊天历史失败" });
    }
  }

  // 获取预约相关的消息
  async getAppointmentMessages(req, res) {
    try {
      const { appointmentId } = req.params;
      const userId = req.user._id;

      // 验证用户是否有权限查看这个预约的消息
      const appointment = await Appointment.findById(appointmentId);
      if (!appointment) {
        return res.status(404).json({ error: "预约不存在" });
      }

      if (
        appointment.userId.toString() !== userId.toString() &&
        appointment.expertId.toString() !== userId.toString()
      ) {
        return res.status(403).json({ error: "无权查看消息" });
      }

      const messages = await Message.find({ appointmentId })
        .sort({ timestamp: 1 })
        .populate("sender", "name email")
        .populate("receiver", "name email");

      res.json(messages);
    } catch (error) {
      console.error("获取预约消息错误:", error);
      res.status(500).json({ error: "获取预约消息失败" });
    }
  }

  // 标记消息为已读
  async markAsRead(req, res) {
    try {
      const { messageIds } = req.body;
      const userId = req.user._id;

      await Message.updateMany(
        {
          _id: { $in: messageIds },
          receiver: userId,
        },
        { isRead: true }
      );

      res.json({ success: true });
    } catch (error) {
      console.error("标记消息已读错误:", error);
      res.status(500).json({ error: "标记消息已读失败" });
    }
  }

  // 获取未读消息数量
  async getUnreadCount(req, res) {
    try {
      const userId = req.user._id;

      const count = await Message.countDocuments({
        receiver: userId,
        isRead: false,
      });

      res.json({ unreadCount: count });
    } catch (error) {
      console.error("获取未读消息数量错误:", error);
      res.status(500).json({ error: "获取未读消息数量失败" });
    }
  }

  // 获取最近的聊天列表
  async getRecentChats(req, res) {
    try {
      const userId = req.user._id;

      // 获取最近的聊天对象
      const recentChats = await Message.aggregate([
        {
          $match: {
            $or: [{ sender: userId }, { receiver: userId }],
          },
        },
        {
          $sort: { timestamp: -1 },
        },
        {
          $group: {
            _id: {
              $cond: {
                if: { $eq: ["$sender", userId] },
                then: "$receiver",
                else: "$sender",
              },
            },
            lastMessage: { $first: "$$ROOT" },
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "_id",
            foreignField: "_id",
            as: "chatUser",
          },
        },
      ]);

      res.json(recentChats);
    } catch (error) {
      console.error("获取最近聊天列表错误:", error);
      res.status(500).json({ error: "获取聊天列表失败" });
    }
  }
}

module.exports = new MessageController();
