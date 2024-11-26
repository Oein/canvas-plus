export default function debug(msg: string) {
  const ovl = document.getElementById("ovl")!;
  while (ovl.children.length > 25) ovl.removeChild(ovl.children[0]);
  const t = new Date();
  const div = document.createElement("div");
  div.innerText = `${t.getHours().toString().padStart(2, "0")}:${t
    .getMinutes()
    .toString()
    .padStart(2, "0")}:${t.getSeconds().toString().padStart(2, "0")} ${msg}`;
  ovl.appendChild(div);
}
