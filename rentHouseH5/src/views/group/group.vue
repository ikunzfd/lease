<template>
  <div class="group-page">
    <div class="group-banner">
      <h2 class="banner-title">租房生活圈</h2>
      <p class="banner-desc">发现同城好房，分享生活点滴</p>
    </div>

    <div class="card article-card" v-for="item in articles" :key="item.id">
      <van-image
        v-if="item.image"
        :src="item.image"
        width="100%"
        height="160px"
        fit="cover"
        radius="8px"
      />
      <h3 class="article-title">{{ item.title }}</h3>
      <p class="article-desc">{{ item.desc }}</p>
      <div class="article-footer">
        <span class="article-tag">{{ item.tag }}</span>
        <span class="article-time">{{ item.time }}</span>
      </div>
    </div>

    <div class="text-center py-6">
      <van-button type="primary" size="small" to="/search">查看更多房源</van-button>
    </div>
  </div>
</template>

<script setup lang="ts">
const articles = [
  {
    id: 1,
    title: '租房避坑指南：新手必读的10个注意事项',
    desc: '签合同前一定要仔细阅读这些条款，避免入住后的各种麻烦...',
    tag: '租房攻略',
    time: '2024-01-15',
    image: '',
  },
  {
    id: 2,
    title: '深圳租房市场分析：这些区域性价比最高',
    desc: '深漂必看！各区域房租对比及交通便利度分析...',
    tag: '市场分析',
    time: '2024-01-10',
    image: '',
  },
  {
    id: 3,
    title: '小空间收纳妙招：让你的出租屋更温馨',
    desc: '即使只有20平米，也能住出80平米的体验感...',
    tag: '生活技巧',
    time: '2024-01-05',
    image: '',
  },
]
</script>

<style lang="less" scoped>
.group-page {
  min-height: 100vh;
  padding-bottom: 30px;
}

.group-banner {
  background: linear-gradient(135deg, #ff6b35 0%, #f7931e 100%);
  padding: 24px 16px;
  margin-bottom: 12px;

  .banner-title {
    font-size: 22px;
    font-weight: 700;
    color: #fff;
    margin-bottom: 4px;
  }

  .banner-desc {
    font-size: 13px;
    color: rgba(255, 255, 255, 0.85);
  }
}

.article-card {
  margin: 0 12px 12px;

  .article-title {
    font-size: 16px;
    font-weight: 600;
    margin: 10px 0 6px;
    color: #323233;
  }

  .article-desc {
    font-size: 13px;
    color: #646566;
    line-height: 1.6;
    margin-bottom: 10px;
  }

  .article-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 12px;
  }

  .article-tag {
    color: #1989fa;
    background: #e8f2ff;
    padding: 2px 8px;
    border-radius: 4px;
  }

  .article-time {
    color: #969799;
  }
}
</style>
