const Notification = require("../models/notificationModel");
const userConnections = new Map();
const notificationQueue = [];

const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 5000;

const setupSSE = (app) => {
  app.get("/sse", async (req, res) => {
    const userId = req.user?.id || req.query.userId;

    if (!userId) {
      res.status(401).send("User ID required");
      return;
    }

    // Set proper SSE headers
    res.writeHead(200, {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no", // Important for nginx
      // Don't set Access-Control-Allow-Origin here since you're using cors middleware
    });

    // Initialize connection with a comment to ensure the connection is established
    res.write(": connected\n\n");

    // Add the connection
    if (!userConnections.has(userId)) {
      userConnections.set(userId, new Set());
    }
    userConnections.get(userId).add(res);

    // console.log(`Client connected - User ID: ${userId}`, {
    //   activeConnections: userConnections.get(userId).size,
    //   timestamp: new Date().toISOString(),
    // });

    // Fetch and send initial unread notifications - DISABLED
    // try {
    //   const notifications = await Notification.find({
    //     user: userId,
    //     channel: "web",
    //     status: "unread",
    //   }).lean(); // Use lean() for better performance

    //   console.log(
    //     `Found ${notifications.length} unread notifications for user ${userId}`
    //   );

    //   for (const notification of notifications) {
    //     const notificationData = {
    //       ...notification,
    //       user: notification.user.toString(),
    //       _id: notification._id.toString(),
    //     };

    //     // Send immediately and enqueue if failed
    //     const sendResult = pushNotification(notificationData);
    //     if (!sendResult.success) {
    //       enqueueNotification(notificationData);
    //     }
    //   }
    // } catch (error) {
    //   console.error("Error fetching unread notifications:", error);
    // }

    // Keep connection alive with ping
    const pingInterval = setInterval(() => {
      if (res.writableEnded) {
        clearInterval(pingInterval);
        return;
      }
      res.write(": ping\n\n");
    }, 30000); // 30 seconds ping

    // Handle client disconnect
    req.on("close", () => {
      clearInterval(pingInterval);
      const userConnections_ = userConnections.get(userId);
      if (userConnections_) {
        userConnections_.delete(res);
        if (userConnections_.size === 0) {
          userConnections.delete(userId);
        }
      }
      // console.log(`Client disconnected - User ID: ${userId}`, {
      //   remainingConnections: userConnections.get(userId)?.size || 0,
      //   timestamp: new Date().toISOString(),
      // });
    });
  });
};

const pushNotification = (notificationData) => {
  // DISABLED: Return early to prevent web notifications
  return { success: false, error: "Web notifications disabled" };

  // const userConnections_ = userConnections.get(notificationData.user);

  // if (!userConnections_ || userConnections_.size === 0) {
  //   console.log(`No active connections for user ${notificationData.user}`);
  //   return { success: false, error: "No active connections for user" };
  // }

  // let allSuccess = true;
  // const errors = [];

  // userConnections_.forEach((connection) => {
  //   try {
  //     // Proper SSE message format
  //     const message = `data: ${JSON.stringify(notificationData)}\nid: ${
  //       notificationData._id
  //     }\n\n`;

  //     if (!connection.writableEnded) {
  //       connection.write(message);
  //       console.log(`Notification sent to user ${notificationData.user}:`, {
  //         id: notificationData._id,
  //         content: notificationData.content,
  //         timestamp: new Date().toISOString(),
  //       });
  //     } else {
  //       throw new Error("Connection ended");
  //     }
  //   } catch (error) {
  //     console.error(`Failed to send notification:`, {
  //       userId: notificationData.user,
  //       notificationId: notificationData._id,
  //       error: error.message,
  //       timestamp: new Date().toISOString(),
  //     });
  //     allSuccess = false;
  //     errors.push(error.message);
  //   }
  // });

  // return {
  //   success: allSuccess,
  //   errors: errors.length ? errors : undefined,
  // };
};

// Utility function to get active connection count for a user
const getActiveConnectionCount = (userId) => {
  return userConnections.get(userId)?.size || 0;
};

// Enqueue a notification without duplicates
const enqueueNotification = (notificationData) => {
  // DISABLED: Return early to prevent notification queuing
  return;

  // const isDuplicate = notificationQueue.some(
  //   (notification) => notification._id === notificationData._id
  // );

  // if (isDuplicate) {
  //   console.log(
  //     "Duplicate notification detected, skipping enqueue:",
  //     notificationData._id
  //   );
  //   return; // Skip adding the duplicate notification
  // }

  // // Add notification with lastSent initialised to null
  // notificationQueue.push({ ...notificationData, lastSent: null });
  // console.log("Notification enqueued:", notificationData.content);
};

// Process the notification queue
const processQueue = async () => {
  // DISABLED: Return early to prevent queue processing
  return;

  // while (notificationQueue.length > 0) {
  //   const notification = notificationQueue[0]; // Peek at the first notification

  //   const now = Date.now();
  //   const oneMinute = 60 * 1000;

  //   // Check if the notification was sent recently
  //   if (notification.lastSent && now - notification.lastSent < oneMinute) {
  //     console.log("Notification sent recently, skipping:", notification._id);
  //     notificationQueue.shift(); // Remove from the queue without re-sending
  //     continue;
  //   }

  //   let attempts = 0;
  //   let success = false;

  //   while (attempts < MAX_RETRIES && !success) {
  //     const result = pushNotification(notification);

  //     if (result.success) {
  //       success = true;
  //       notification.lastSent = now; // Update lastSent timestamp
  //       console.log("Notification sent successfully:", notification);
  //     } else {
  //       attempts++;
  //       console.error(
  //         `Attempt ${attempts} failed for notification:`,
  //         notification,
  //         "Error:",
  //         result.error
  //       );
  //       if (attempts < MAX_RETRIES) {
  //         await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS));
  //       }
  //     }
  //   }

  //   if (!success) {
  //     console.error(
  //       "Failed to send notification after max retries:",
  //       notification
  //     );
  //     // Optionally save the failed notification for manual inspection or retry later
  //   }

  //   notificationQueue.shift(); // Remove the notification after processing
  // };
};

module.exports = {
  setupSSE,
  pushNotification,
  enqueueNotification,
  processQueue,
  getActiveConnectionCount,
};
