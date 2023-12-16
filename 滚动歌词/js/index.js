/**
 * 解析歌词字符串
 * 得到一个歌词对象的数组
 * 每个歌词对象：
 * {time:开始时间，words:歌词内容}
 */
function parseLrc() {
  let result = [];
  for (const key in lrcJSON) {
    const element = lrcJSON[key];
    let obj = {
      time: parseTime(key.substring(1, key.length - 1)),
      words: element,
    };
    result.push(obj);
  }
  return result;
}

/**
 * 将一个时间字符串解析为数字（秒）
 * @param {*} timeStr
 * @returns
 */
function parseTime(timeStr) {
  let parts = timeStr.split(":");
  return parts[0] * 60 + +parts[1];
}
let lrcData = parseLrc();

var doms = {
  audio: document.querySelector("audio"),
  ul: document.querySelector("ul"),
  container: document.querySelector(".container"),
};
/**
 * 计算出，在当前播放器播放到第几秒的情况下
 * lrcData数组中，应该高亮显示的歌词下标
 */
function findIndex() {
  // 播放器当前时间
  let curTime = doms.audio.currentTime;
  for (let i = 0; i < lrcData.length; i++) {
    let item = lrcData[i];
    if (curTime < item.time) {
      return i - 1;
    }
  }
  // 找遍了都没找到（说明播放到最后一句）
  return lrcData.length - 1;
}

/**
 * 创建歌词列表
 */
function createLrcElements() {
  // 文档片段
  let frag = document.createDocumentFragment();
  for (let i = 0; i < lrcData.length; i++) {
    const li = document.createElement("li");
    li.textContent = lrcData[i].words;
    frag.appendChild(li);
  }
  doms.ul.appendChild(frag);
}
createLrcElements();

let containerHeight = doms.container.clientHeight;
let liHeight = doms.ul.children[0].clientHeight;
let maxOffset = doms.ul.clientHeight - containerHeight;
/**
 * 设置 ul 元素的偏移量
 */
function setOffset() {
  let index = findIndex();
  let offset = liHeight * index + liHeight / 2 - containerHeight / 2;
  if (offset < 0) {
    offset = 0;
  }
  if(offset > maxOffset) {
    offset = maxOffset;
  }
  doms.ul.querySelector(".active")?.classList.remove("active");
  doms.ul.style.transform = `translateY(${-offset}px)`;
  doms.ul.children[index]?.classList.add("active");
}
doms.audio.addEventListener("timeupdate", () => {
  setOffset();
});
