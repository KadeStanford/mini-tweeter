

class EventBus {
    constructor() {
      this.events = {};  
    }
  
    subscribe(event, listener) {
      if (!this.events[event]) {
        this.events[event] = [];  
      }
      this.events[event].push(listener); 
    }
  
    
    emit(event, data) {
      if (!this.events[event]) return;  
      this.events[event].forEach(listener => listener(data));  
    }
  }
  
  module.exports = new EventBus();  
  