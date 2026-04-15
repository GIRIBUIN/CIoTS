function saveFeedback(payload) {
    return {
      message: "feedback endpoint ready",
      received: payload || {}
    };
  }
  
  module.exports = {
    saveFeedback
  };