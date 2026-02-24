import api from "./axios.js";

export default {

  async listMembershipTypes(params = {}) {
    try {
      const response = await api.get("/membership/membership-types/", {
        params,
      });
      return response.data;
    } catch (error) {
      console.error("List membership types API error:", error);
      throw error;
    }
  },

  async getMembershipType(id) {
    try {
      const response = await api.get(`/membership/membership-types/${id}/`);
      return response.data;
    } catch (error) {
      console.error("Get membership type API error:", error);
      throw error;
    }
  },

  async createMembershipType(payload) {
    try {
      const response = await api.post("/membership/membership-types/", payload);
      return response.data;
    } catch (error) {
      console.error("Create membership type API error:", error);
      throw error;
    }
  },

  async updateMembershipType(id, payload) {
    try {
      const response = await api.patch(
        `/membership/membership-types/${id}/`,
        payload
      );
      return response.data;
    } catch (error) {
      console.error("Update membership type API error:", error);
      throw error;
    }
  },

  async deleteMembershipType(id) {
    try {
      const response = await api.delete(`/membership/membership-types/${id}/`);
      return response.data;
    } catch (error) {
      console.error("Delete membership type API error:", error);
      throw error;
    }
  },


  async listApplications(params = {}) {
    try {
      const response = await api.get("/membership/applications/", { params });
      return response.data;
    } catch (error) {
      console.error("List applications API error:", error);
      throw error;
    }
  },

  async getApplication(id) {
    try {
      const response = await api.get(`/membership/applications/${id}/`);
      return response.data;
    } catch (error) {
      console.error("Get application API error:", error);
      throw error;
    }
  },

  async createApplication(payload) {
    try {
      const response = await api.post("/membership/applications/", payload);
      return response.data;
    } catch (error) {
      console.error("Create application API error:", error);
      throw error;
    }
  },

  async updateApplication(id, payload) {
    try {
      const response = await api.patch(
        `/membership/applications/${id}/`,
        payload
      );
      return response.data;
    } catch (error) {
      console.error("Update application API error:", error);
      throw error;
    }
  },

  async deleteApplication(id) {
    try {
      const response = await api.delete(`/membership/applications/${id}/`);
      return response.data;
    } catch (error) {
      console.error("Delete application API error:", error);
      throw error;
    }
  },

  async getMyApplication() {
    try {
      const response = await api.get(
        "/membership/applications/my_application/"
      );
      return response.data;
    } catch (error) {
      console.error("Get my application API error:", error);
      throw error;
    }
  },

  async approveApplication(id, payload) {
    try {
      const response = await api.post(
        `/membership/applications/${id}/approve/`,
        payload
      );
      return response.data;
    } catch (error) {
      console.error("Approve application API error:", error);
      throw error;
    }
  },

  async rejectApplication(id, payload) {
    try {
      const response = await api.post(
        `/membership/applications/${id}/reject/`,
        payload
      );
      return response.data;
    } catch (error) {
      console.error("Reject application API error:", error);
      throw error;
    }
  },


  async listSubscriptions(params = {}) {
    try {
      const response = await api.get("/membership/subscriptions/", { params });
      return response.data;
    } catch (error) {
      console.error("List subscriptions API error:", error);
      throw error;
    }
  },

  async getSubscription(id) {
    try {
      const response = await api.get(`/membership/subscriptions/${id}/`);
      return response.data;
    } catch (error) {
      console.error("Get subscription API error:", error);
      throw error;
    }
  },

  async createSubscription(payload) {
    try {
      const response = await api.post("/membership/subscriptions/", payload);
      return response.data;
    } catch (error) {
      console.error("Create subscription API error:", error);
      throw error;
    }
  },

  async updateSubscription(id, payload) {
    try {
      const response = await api.patch(
        `/membership/subscriptions/${id}/`,
        payload
      );
      return response.data;
    } catch (error) {
      console.error("Update subscription API error:", error);
      throw error;
    }
  },

  async cancelSubscription(id) {
    try {
      const response = await api.post(
        `/membership/subscriptions/${id}/cancel/`
      );
      return response.data;
    } catch (error) {
      console.error("Cancel subscription API error:", error);
      throw error;
    }
  },
  async getUnpaidMembers() {
    try {
      const response = await api.get("/membership/unpaid/");
      return response.data;
    } catch (error) {
      console.error("Get unpaid members API error:", error);
      throw error;
    }
  },
  async createMember(payload) {
    try {
      const response = await api.post("/membership/subscriptions/admin-create-member-subscription/", payload);
      return response.data;
    } catch (error) {
      console.error("Create member API error:", error);
      throw error;
    }
  },
};
