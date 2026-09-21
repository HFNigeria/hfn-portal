import api from './axios.js';

export default {
  async sendConnectionRequest(payload) {
    try {
      const response = await api.post(
        '/messaging/connections/request/',
        payload
      );
      return response.data;
    } catch (error) {
      console.error('Send connection request API error');
      throw error;
    }
  },

  async listConnections(params = {}) {
    try {
      const response = await api.get('/messaging/connections/', { params });
      return response.data;
    } catch (error) {
      console.error('List connections API error');
      throw error;
    }
  },

  async getPendingConnections(params = {}) {
    try {
      const response = await api.get('/messaging/connections/pending/', {
        params,
      });
      return response.data;
    } catch (error) {
      console.error('Get pending connections API error');
      throw error;
    }
  },

  async acceptConnectionRequest(id) {
    try {
      const response = await api.post(
        `/messaging/connections/${id}/accept/`,
        {}
      );
      return response.data;
    } catch (error) {
      console.error('Accept connection request API error');
      throw error;
    }
  },

  async declineConnectionRequest(id) {
    try {
      const response = await api.post(
        `/messaging/connections/${id}/decline/`,
        {}
      );
      return response.data;
    } catch (error) {
      console.error('Decline connection request API error');
      throw error;
    }
  },

  async blockUser(id) {
    try {
      const response = await api.post(`/messaging/connections/${id}/block/`);
      return response.data;
    } catch (error) {
      console.error('Block user API error');
      throw error;
    }
  },

  async sendMessage(payload) {
    try {
      const response = await api.post('/messaging/messages/', payload);
      return response.data;
    } catch (error) {
      console.error('Send message API error');
      throw error;
    }
  },

  async getMessagesWithUser(params) {
    try {
      const response = await api.get('/messaging/messages/with_user/', {
        params,
      });
      return response.data;
    } catch (error) {
      console.error('Get messages with user API error');
      throw error;
    }
  },

  async getConversations(params = {}) {
    try {
      const response = await api.get('/messaging/messages/conversations/', {
        params,
      });
      return response.data;
    } catch (error) {
      console.error('Get conversations API error');
      throw error;
    }
  },

  async markMessageAsRead(id) {
    try {
      const response = await api.patch(`/messaging/messages/${id}/read/`, {});
      return response.data;
    } catch (error) {
      console.error('Mark message as read API error');
      throw error;
    }
  },

  async listGroups(params = {}) {
    try {
      const response = await api.get('/messaging/groups/', { params });
      return response.data;
    } catch (error) {
      console.error('List groups API error');
      throw error;
    }
  },

  async createGroup(payload) {
    try {
      const response = await api.post('/messaging/groups/', payload);
      return response.data;
    } catch (error) {
      console.error('Create group API error');
      throw error;
    }
  },

  async getGroupDetails(id) {
    try {
      const response = await api.get(`/messaging/groups/${id}/`);
      return response.data;
    } catch (error) {
      console.error('Get group details API error');
      throw error;
    }
  },

  async joinGroup(id) {
    try {
      const response = await api.post(`/messaging/groups/${id}/join/`, {});
      return response.data;
    } catch (error) {
      console.error('Join group API error');
      throw error;
    }
  },

  async leaveGroup(id) {
    try {
      const response = await api.post(`/messaging/groups/${id}/leave/`, {});
      return response.data;
    } catch (error) {
      console.error('Leave group API error');
      throw error;
    }
  },

  async removeGroupMember(id, payload) {
    try {
      const response = await api.post(
        `/messaging/groups/${id}/remove_member/`,
        payload
      );
      return response.data;
    } catch (error) {
      console.error('Remove group member API error');
      throw error;
    }
  },

  async sendGroupMessage(payload) {
    try {
      const response = await api.post(
        `/messaging/groups/${payload.group_id}/messages/`,
        { content: payload.content }
      );
      return response.data;
    } catch (error) {
      console.error('Send group message API error');
      throw error;
    }
  },

  async getGroupMessages(group_id) {
    try {
      const response = await api.get(`/messaging/groups/${group_id}/messages/`);
      return response.data;
    } catch (error) {
      console.error('Get group messages API error');
      throw error;
    }
  },

  async listForums(params = {}) {
    try {
      const response = await api.get('/messaging/forums/', { params });
      return response.data;
    } catch (error) {
      console.error('List forums API error');
      throw error;
    }
  },

  async createForum(payload) {
    try {
      const response = await api.post('/messaging/forums/', payload);
      return response.data;
    } catch (error) {
      console.error('Create forum API error');
      throw error;
    }
  },

  async createForumPost(payload) {
    try {
      const response = await api.post('/messaging/posts/', payload);
      return response.data;
    } catch (error) {
      console.error('Create forum post API error');
      throw error;
    }
  },

  async getPostDetails(id) {
    try {
      const response = await api.get(`/messaging/posts/${id}/`);
      return response.data;
    } catch (error) {
      console.error('Get post details API error');
      throw error;
    }
  },

  async replyToPost(post_id, payload) {
    try {
      const response = await api.post(
        `/messaging/posts/${post_id}/replies/`,
        payload
      );
      return response.data;
    } catch (error) {
      console.error('Reply to post API error');
      throw error;
    }
  },

  async pinPost(id) {
    try {
      const response = await api.post(`/messaging/posts/${id}/pin/`);
      return response.data;
    } catch (error) {
      console.error('Pin post API error');
      throw error;
    }
  },

  async lockPost(id) {
    try {
      const response = await api.post(`/messaging/posts/${id}/lock/`);
      return response.data;
    } catch (error) {
      console.error('Lock post API error');
      throw error;
    }
  },

  async listNotifications(params = {}) {
    try {
      const response = await api.get('/messaging/notifications/', { params });
      return response.data;
    } catch (error) {
      console.error('List notifications API error');
      throw error;
    }
  },

  async listUnreadNotifications(params = {}) {
    try {
      const response = await api.get('/messaging/notifications/unread/', {
        params,
      });
      return response.data;
    } catch (error) {
      console.error('List unread notifications API error');
      throw error;
    }
  },

  async getUnreadCount() {
    try {
      const response = await api.get('/messaging/notifications/unread_count/');
      return response.data;
    } catch (error) {
      console.error('Get unread notifications count API error');
      throw error;
    }
  },

  async markNotificationAsRead(id) {
    try {
      const response = await api.patch(
        `/messaging/notifications/${id}/read/`,
        {}
      );
      return response.data;
    } catch (error) {
      console.error('Mark notification as read API error');
      throw error;
    }
  },

  async searchMembers(query) {
    try {
      const response = await api.get('/messaging/connections/directory', {
        params: { search: query },
      });
      return response.results || [];
    } catch (err) {
      console.error('Search members API error:', err);
      throw err;
    }
  },

  async dismissNotification(id) {
    try {
      const response = await api.patch(
        `/messaging/notifications/${id}/dismiss/`
      );
      return response.data;
    } catch (error) {
      console.error('Dismiss notification API error');
      throw error;
    }
  },

  async getNotificationPreferences() {
    try {
      const response = await api.get('/messaging/notifications/preferences/');
      return response.data;
    } catch (error) {
      console.error('Get notification preferences API error');
      throw error;
    }
  },

  async updateNotificationPreferences(payload) {
    try {
      const response = await api.put(
        '/messaging/notifications/preferences/',
        payload
      );
      return response.data;
    } catch (error) {
      console.error('Update notification preferences API error');
      throw error;
    }
  },
  async deleteNotification(id) {
    try {
      const response = await api.delete(`/messaging/notifications/${id}/`);
      return response.data;
    } catch (error) {
      console.error('Dismiss notification API error');
      throw error;
    }
  },
  async deleteGroup(id) {
    try {
      const response = await api.delete(`/messaging/groups/${id}/`);
      return response.data;
    } catch (error) {
      console.error('Delete group API error');
      throw error;
    }
  },
  async broadcastMessage() {
    try {
      const response = await api.post(
        '/messaging/notifications/broadcast_unpaid_subscriptions/'
      );
      return response.data;
    } catch (error) {
      console.error('Message API error');
      throw error;
    }
  },
  async sendFeedback(payload) {
    try {
      const response = await api.post('/contact/feedback/', payload);
      return response.data;
    } catch (error) {
      console.error('Send feedback API error');
      throw error;
    }
  },
  async listFeedback() {
    try {
      const response = await api.get('/contact/feedback/');
      return response.data;
    } catch (error) {
      console.error('List feedback API error');
      throw error;
    }
  },
  async getFeedback(id) {
    try {
      const response = await api.get(`/contact/feedback/${id}/`);
      return response.data;
    } catch (error) {
      console.error('Get feedback API error');
      throw error;
    }
  },
};
