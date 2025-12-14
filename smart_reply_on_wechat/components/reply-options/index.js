// components/reply-options/index.js
Component({
  properties: {
    options: {
      type: Array,
      value: [],
    },
  },
  data: {
    copiedIndex: -1, // 记录已复制的索引
  },
  methods: {
    // 复制文案
    copyWording(e) {
      const { wording, index } = e.currentTarget.dataset;
      wx.setClipboardData({
        data: wording,
        success: () => {
          // 设置已复制状态
          this.setData({
            copiedIndex: index,
          });
          
          // 2秒后恢复
          setTimeout(() => {
            this.setData({
              copiedIndex: -1,
            });
          }, 2000);
        },
        fail: () => {
          wx.showToast({
            title: "复制失败",
            icon: "none",
          });
        },
      });
    },
  },
});

