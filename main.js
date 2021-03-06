"use strict";

const sectionS = document.querySelectorAll("section");
sectionS.forEach(buildResult);
function buildResult(s, i) {
  const allFieldS = s.querySelectorAll("select");
  let position = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  allFieldS.forEach(arrangeDigitsInEach3by3);
  function arrangeDigitsInEach3by3(sel, selI) {
    const selCol = (i % 3) * 3 + 1 + (selI % 3);
    const selRow = (selI - (selI % 3)) / 3 + (i - (i % 3));
    sel.setAttribute("data-row", selRow);
    sel.setAttribute("data-col", selCol);

    sel
      .querySelector(`option:nth-of-type(${selI + 1})`)
      .setAttribute("selected", ""); // by default, assign digit value based on their index+1, so that digits range from 1-9
    const cellIndex = position[Math.floor(Math.random() * position.length)];
    const columnStart = cellIndex % 3 === 0 ? 3 : cellIndex % 3;
    const rowStart = (cellIndex - columnStart) / 3 + 1;
    sel.querySelector(
      `option:nth-of-type(${cellIndex})`
    ).parentElement.style.gridColumnStart = columnStart;
    sel.querySelector(
      `option:nth-of-type(${cellIndex})`
    ).parentElement.style.gridRowStart = rowStart; // rearrange the digit based on random pick from position array
    position.splice(position.indexOf(cellIndex), 1); // update position array, so each position (1-9) only gets picked once
  }
}
checkCol(); // check col by default
function checkCol() {
  for (let colNr = 1; colNr < 10; colNr++) {
    let fieldCol;
    if (colNr >= 1 && colNr <= 3) {
      fieldCol = 1;
    } else if (colNr >= 4 && colNr <= 6) {
      fieldCol = 2;
    } else if (colNr >= 7 && colNr <= 9) {
      fieldCol = 3;
    }
    const colS = document.querySelectorAll(
      `section:nth-of-type(3n+${fieldCol}) [style^='grid-column-start: ${
        colNr % 3 === 0 ? 3 : colNr % 3
      }']`
    );
    let valueS = [];
    let filterDup = [];
    for (let rI = 1; rI < 10; rI++) {
      valueS.push(
        colS[rI - 1].querySelector("[selected]").getAttribute("value")
      ); // not in the exact same order as in one column, but no effect on checking dulplication.
      // console.log(valueS); // check this log to see exact order
      filterDup = valueS.filter((e, i) => valueS.indexOf(e) === i);
      if (valueS.length !== filterDup.length) {
        colS[rI - 1].classList.add("dup-col");
        break;
      } else {
        colS[rI - 1].classList.remove("dup-col");
      }
    }
  }
}
//checkRow();
function checkRow(rowNr) {
  //  for (let rowNr = 1; rowNr < 10; rowNr++) {
  let valueS = [];
  let filterDup = [];
  let fieldIndexArray = [];
  if (rowNr >= 1 && rowNr < 4) fieldIndexArray = [1, 2, 3];
  if (rowNr >= 4 && rowNr < 7) fieldIndexArray = [4, 5, 6];
  if (rowNr >= 7 && rowNr < 10) fieldIndexArray = [7, 8, 9];
  fieldIndexArray.forEach(getRow);
  function getRow(i) {
    const field = document.querySelector(`section:nth-of-type(${i})`);
    const digitSInRow = field.querySelectorAll(
      `[style*='grid-row-start: ${rowNr % 3 === 0 ? 3 : rowNr % 3}']`
    );
    digitSInRow.forEach(getValue);
    function getValue(d) {
      let value = d.querySelector("[selected").getAttribute("value");
      valueS.push(value);
    }
  }
  console.log(valueS);
  filterDup = valueS.filter((e, ei) => valueS.indexOf(e) === ei);
  if (valueS.length !== filterDup.length) {
    console.log("has dup at row " + rowNr);
    //      colS[rI - 1].classList.add("dup-row");
    //break;
  } else {
    //    colS[rI - 1].classList.remove("dup-row");
  }
}

// listen to user select, and rerun check col
const allDigitS = document.querySelectorAll("select");
allDigitS.forEach(d => {
  d.addEventListener("change", changeValue);
});
function changeValue(o) {
  for (let sectionI = 0; sectionI < 10; sectionI++) {
    if (sectionS[sectionI] === o.target.parentElement) {
      let cellRow = Math.ceil((sectionI + 1) / 3);
      let digitRow = o.target.getAttribute("style")[
        o.target.getAttribute("style").indexOf("grid-row-start:") + 16
      ];
      let rowNr = (Number(cellRow) - 1) * 3 + Number(digitRow);
      console.log(rowNr);
      o.target.querySelector("[selected]").removeAttribute("selected");
      console.log(o.target[o.target.selectedIndex]); // use this to get  the newly selected value, even though it doesn't have the 'selected' attribute
      o.target[o.target.selectedIndex].setAttribute("selected", "");
      checkCol();
      checkRow(rowNr);
    }
  }
}
