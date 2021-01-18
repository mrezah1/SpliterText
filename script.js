const theme = document.querySelector("#theme input");
const input = document.querySelector("#input");
const setting_box = document.querySelector("#setting");
const setting_icon = document.querySelector("#setting_icon");
const setting_close = document.querySelector("#setting_close");
const ch_input = document.querySelectorAll("input.empty");
// selecto setting field
const count_DIV = document.querySelector("#count_DIV");
const char_DIV = document.querySelector("#char_DIV");
const enable_input = document.querySelector("#enable_field");
const rtl = document.querySelector("#right_to_left");
const ltr = document.querySelector("#left_to_right");
let time_copy;
let setting = {
  count_DIV: Number(getVal("#count_DIV")),
  char_DIV: getVal("#char_DIV"),
  enable_input: enable_input.checked,
  rtl: rtl.checked,
  ltr: ltr.checked,
};
input.focus();
// process division 😍
input.addEventListener("keyup", (e) => {
  // show label output
  document.querySelector(".output").removeAttribute("style");
  document.querySelector(".processing").style.display = "none";
  let show = document.querySelector("#show");
  let value = e.target.value.split(` ${setting.char_DIV} `).join("");
  if (setting.ltr)
    show.innerHTML = [...value]
      .map((n, i, a) => {
        return i % setting.count_DIV == 0 && i != 0
          ? ` ${setting.char_DIV} ${n}`
          : n;
      })
      .join("");
  else
    show.innerHTML = [...value]
      .reverse()
      .map((n, i) => {
        return i > 2 && i % 3 == 0 ? `${n} ${setting.char_DIV} ` : n;
      })
      .reverse()
      .join("");
  // check enable input
  if (setting.enable_input) input.value = show.innerHTML;
});
input.addEventListener("keydown", (e) => {
  let rows = input.getAttribute("rows");
  if (e.keyCode === 8 && rows > 1)
    if (e.target.scrollHeight < e.target.offsetHeight)
      input.setAttribute("rows", String(Number(rows) - 1));
  if (e.keyCode !== 8 && e.target.scrollHeight > e.target.offsetHeight)
    input.setAttribute("rows", String(Number(rows) + 1));
});
input.addEventListener("keypress", (e) => {
  // show loading process
  document.querySelector(".processing").removeAttribute("style");
  document.querySelector(".output").style.display = "none";
});
// open popup
setting_icon.addEventListener("click", () => {
  setting_box.style.height = "100vh";
  document.body.classList.add("hidden-scroll");
  clear();
});
setting_close.addEventListener("click", close_setting);
setting_box.addEventListener("click", (e) => {
  if (e.target == setting_box) close_setting();
});
function close_setting() {
  document.body.classList.remove("hidden-scroll");
  setting_box.style.height = "0";
}
// enable and disable input style
function check_checked(e) {
  // check parametr event element or element
  let selector = e.classList == undefined ? e.target : e;
  if (selector.checked) selector.previousElementSibling.classList.add("ch-on");
  else selector.previousElementSibling.classList.remove("ch-on");
  setting.ltr = ltr.checked;
  setting.rtl = rtl.checked;
}
ch_input.forEach((a) => {
  a.addEventListener("change", check_checked);
  check_checked(a);
});
rtl.addEventListener("change", (e) => {
  ltr.checked = !e.target.checked;
  check_checked(ltr);
});
ltr.addEventListener("change", (e) => {
  rtl.checked = !e.target.checked;
  check_checked(rtl);
});
// disable type input count division
count_DIV.addEventListener("keydown", (e) => {
  e.preventDefault();
});
// update setting on change input
count_DIV.addEventListener("change", (e) => {
  setting.count_DIV = Number(e.target.value.trim());
});
enable_input.addEventListener("change", (e) => {
  setting.enable_input = e.target.checked;
});
// if input setting was null => set to initial value:
char_DIV.addEventListener("blur", (e) => {
  if (e.target.value.trim() === "" || e.target.value == undefined)
    e.target.value = "*";
  setting.char_DIV = e.target.value.trim();
});
// change theme dark or light
theme.addEventListener("change", (e) => {
  input.focus();
  let txt = document.querySelector("#theme span");
  if (e.target.checked) {
    txt.innerHTML = "Light";
    document.body.classList.add("light");
    setting_icon.style.fill = "#30394b";
    setting_box.style.backgroundColor = "rgba(255,255,255,.9)";
    setting_box.querySelector("div").style.backgroundColor = "#30394b";
    setting_box.querySelector("div").style.color = "#fff";
    document.querySelector(".division span").style.color = "lightpink";
    document
      .querySelectorAll(".processing span")
      .forEach((a) => (a.style.backgroundColor = "#222"));
  } else {
    txt.innerHTML = "Dark";
    document.body.classList.remove("light");
    setting_icon.style.fill = "#fff";
    setting_box.style.color = "#fff";
    setting_box.style.backgroundColor = "";
    setting_box.querySelector("div").style.backgroundColor = "#fff";
    setting_box.querySelector("div").style.color = "#222";
    document.querySelector(".division span").style.color = "#6a197d";
    document
      .querySelectorAll(".processing span")
      .forEach((a) => (a.style.backgroundColor = "#fff"));
  }
});
function getVal(selector) {
  return document.querySelector(selector).value;
}
function clear() {
  input.value = "";
  document.querySelector("#show").innerHTML = "";
}
document.querySelector("#copy svg").addEventListener("click", (e) => {
  if (input.value.trim() != "") {
    clearTimeout(time_copy);
    let range = document.createRange();
    range.selectNode(show);
    window.getSelection().removeAllRanges();
    window.getSelection().addRange(range);
    document.execCommand("copy");
    window.getSelection().removeAllRanges();
    document.querySelector("#copied").style.opacity = "1";
    time_copy = setTimeout(() => {
      document.querySelector("#copied").style.opacity = "0";
    }, 1500);
  }
});
