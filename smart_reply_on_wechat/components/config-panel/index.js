// components/config-panel/index.js
Component({
  properties: {
    show: {
      type: Boolean,
      value: false,
    },
    relation: {
      type: String,
      value: "朋友",
    },
    relationDensity: {
      type: String,
      value: "很熟",
    },
    replyStyle: {
      type: String,
      value: "轻松",
    },
  },
  data: {
    relationOptions: ["恋人", "同事", "领导", "朋友"],
    relationDensityOptions: ["陌生人", "刚认识", "很熟", "非常熟"],
    replyStyleOptions: ["幽默", "轻松", "夸夸", "严肃", "严厉"],
  },
  methods: {
    onClose() {
      this.triggerEvent("close");
    },
    onRelationChange(e) {
      const relation = e.currentTarget.dataset.value;
      this.triggerEvent("change", {
        type: "relation",
        value: relation,
      });
    },
    onRelationDensityChange(e) {
      const relationDensity = e.currentTarget.dataset.value;
      this.triggerEvent("change", {
        type: "relationDensity",
        value: relationDensity,
      });
    },
    onReplyStyleChange(e) {
      const replyStyle = e.currentTarget.dataset.value;
      this.triggerEvent("change", {
        type: "replyStyle",
        value: replyStyle,
      });
    },
  },
});

