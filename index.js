import { debounceTime, map, distinctUntilChanged, mergeMap,} from "rxjs/operators";

import { fromEvent, of } from "rxjs";

const url = "http://localhost:3000/clubs?q=";

let entradaTxt = document.getElementById("text-input");
let txtMuda$ = fromEvent(entradaTxt, "keyup");

let autoSugerir$ = 
  txtMuda$
    .pipe(
      map((e) => e.target.value),
      debounceTime(500),
      distinctUntilChanged(),
      mergeMap((value) =>
        value ? fetch(url + value).then((response) => response.json()) : of([])
      )
    );

autoSugerir$.subscribe((v) => {
  let list = document.getElementsByClassName("list-group")[0];
  while (list.firstChild) {
    list.removeChild(list.firstChild);
  }

  for (let club of v) {
    let li = document.createElement("li");
    let textNode = document.createTextNode(club.nome);
    li.setAttribute("class", "list-group-item list-group-item-primary");
    li.appendChild(textNode);
    list.appendChild(li);
  }
});
