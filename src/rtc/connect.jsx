class peer {
  constructor() {
    this.peer = new RTCPeerConnection({
      iceServers: [
        { urls: "stun:stun.l.google.com:19302" },
        {
          urls: "turn:free.expressturn.com:3478",
          username: "000000002089219264",
          credential: "T0FVyW9Zzu7BvJN6lt3MuHevUeA=",
        },
      ],
    });
  }
  async getOffer() {
    if (this.peer) {
      const offer = await this.peer.createOffer();
      await this.peer.setLocalDescription(offer);
      return offer;
    }
  }

  async getanswer() {
    if (this.peer) {
      const answer = await this.peer.createAnswer();
      await this.peer.setLocalDescription(answer);
      return answer;
    }
  }
}
export default new peer();
