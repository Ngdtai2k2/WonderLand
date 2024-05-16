const algorithmsService = {
  // Simplified algorithm to remove Affinity score
  calculateEdgeRank: async ({
    likes = 0,
    comments = 0,
    shares = 0,
    createdAt,
    // affinityScore = 0,
  }) => {
    const weight = (likes * 1) + (comments * 2) + (shares * 3);
    
    const now = new Date();
    const postTime = new Date(createdAt);
    const hoursSincePost = Math.abs(now - postTime) / 36e5;
    
    const timeDecay = 1 / hoursSincePost;
    // const edgeRank = affinityScore * weight * timeDecay;
    const edgeRank = weight * timeDecay;
    return edgeRank;
  },
};

module.exports = algorithmsService;