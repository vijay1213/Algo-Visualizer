// An array to store the heights of the bars for visualization.
let heights = [];

// An array to store references to the HTML elements representing the bars.
let bars = [];

// An array to store the numerical values of the bars (optional, used for further processing).
let barValues = [];

// HTML element representing a slider used to control the number of bars (n).
let barSlider = document.getElementById('barSlider');

// The initial value of the number of bars (n) is obtained from the barSlider.
let n = barSlider.value;

// HTML element representing a slider used to control the sorting speed.
let speedSlider = document.getElementById('speedSlider');

// The initial delay for visualization is set based on the speedSlider value.
let delay = 375 - speedSlider.value;

// HTML element representing the container in which the bars will be displayed.
let container = document.getElementById('container');

// The width and height of the container to determine the dimensions of the visualization area.
let width = container.offsetWidth;
let height = container.offsetHeight;

// The width of each bar, calculated based on the number of bars (n) and the container width.
let lineWidth = width / n - 1;

// Flags to control the state of the visualization.
let isStopped = true;    // Indicates if the sorting process is stopped.
let isPaused = false;    // Indicates if the sorting process is paused.
let isGenerated = true;  // Indicates if the bars have been generated.
let isSorted = false;    // Indicates if the bars are sorted (used for stopping the visualization).


// Stack implementation.
class Stack {
  constructor() {
    // Internal array to store the elements of the stack.
    this.arr = [];

    // 'top' is an index pointing to the topmost element in the stack.
    // Initialized to -1 to indicate an empty stack.
    this.top = -1;
  }

  // Method to push an element onto the top of the stack.
  push(element) {
    // Increment the 'top' index to move it to the next position.
    this.top++;

    // Add the 'element' to the 'arr' array, placing it at the top position.
    this.arr.push(element);
  }

  // Method to check if the stack is empty.
  isEmpty() {
    // If 'top' is -1, the stack is empty; otherwise, it contains elements.
    return this.top == -1;
  }

  // Method to pop (remove and return) the topmost element from the stack.
  pop() {
    // Check if the stack is not empty.
    if (this.isEmpty() === false) {
      // Decrement the 'top' index to move it down to the previous position.
      this.top = this.top - 1;

      // Remove and return the element at the top position using 'pop()' from the 'arr' array.
      return this.arr.pop();
    }
  }
}


// get random value between min and max;
function getRandomValue(min, max) {
  return Math.random() * (max - min) + min;
}
// Generate random heights of the bar and create div element of the bar.
function generateRandomArray() {
  isGenerated = true;
  isSorted = false;
  isStopped = true;
  isPaused = false;
  n = barSlider.value;
  lineWidth = width / n - 1;
  container.innerHTML = '';
  for (let i = 0; i < n; i++) {
    heights[i] = parseInt(getRandomValue(1, height));
    bars.push(document.createElement('div'));
    bars[i].style.width = `${lineWidth}px`;
    bars[i].style.height = `${heights[i]}px`;
    bars[i].style.transform = `translate(${i * lineWidth + i}px)`;
    bars[i].style.backgroundColor = 'white';
    bars[i].className = 'bar';
    container.appendChild(bars[i]);

    // if there are more numer of bars then it is not feasible to show bar values because they gets mixed up.
    if (n <= 60) {
      barValues.push(document.createElement('div'));
      barValues[i].innerHTML = heights[i];
      barValues[i].style.marginBottom = `${heights[i] + 5}px`;
      barValues[i].style.transform = `translate(${i * lineWidth + i}px)`;
      barValues[i].className = 'barValue';
      container.appendChild(barValues[i]);
    }
  }
}
generateRandomArray();

// swap 2 bars and also swap trnasform property for the animation.
function swap(i, minindex) {
  [heights[i], heights[minindex]] = [heights[minindex], heights[i]];

  [bars[i], bars[minindex]] = [bars[minindex], bars[i]];
  [bars[i].style.transform, bars[minindex].style.transform] = [bars[minindex].style.transform, bars[i].style.transform];

  [barValues[i], barValues[minindex]] = [barValues[minindex], barValues[i]];
  [barValues[i].style.transform, barValues[minindex].style.transform] = [
    barValues[minindex].style.transform,
    barValues[i].style.transform,
  ];
}
// Draw bars with their new Updated heights.
function draw(coloredBars, colors) {
  // coloredBars contains indices of the bars which will be in different color than default color
  // colors array stores color for different bars.
  for (let i = 0; i < n; i++) {
    bars[i].style.backgroundColor = 'white';
    for (let j = 0; j < coloredBars.length; j++) {
      if (i == coloredBars[j]) {
        bars[i].style.backgroundColor = colors[j];
        break;
      }
    }
  }
}

// to put delay between visualization.
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
// Play animation after sorting process is finished
// This is an asynchronous function to perform a sorting visualization using HTML elements.
async function SortedAnimation() {
  
  // First, we will go from left to right and color the elements in some color (lime).
  // The elements to be colored are assumed to be stored in the `bars` array.
  for (let i = 0; i < n; i++) {
    bars[i].style.backgroundColor = 'lime';
    await sleep(10); // Introduce a small delay between each step for visualization effect.
  }

  // After coloring all the elements, we wait for a longer duration (300ms) before proceeding to the next step.
  // This longer wait may indicate the completion of the first part of the visualization.
  await sleep(300);

  // Now, we go through the same elements from left to right again, but this time we color them white.
  // This can give the effect of temporarily highlighting the sorted elements.
  for (let i = 0; i < n; i++) {
    bars[i].style.backgroundColor = 'white';
    await sleep(10); // Introduce a small delay between each step for visualization effect.
  }
}


// Sorting algos implementation starts...
async function bubbleSort() {
  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      if (isStopped) {
        draw([], []);
        return;
      }
      if (!isPaused) {
        if (heights[j] > heights[j + 1]) {
          swap(j, j + 1);
        }
        draw([j, j + 1], ['green', 'yellow']);
      } else {
        j--;
      }
      await sleep(delay);
    }
  }
  console.log('Bubble sort completed.');
  draw([], []);
  isSorted = true;
  isStopped = true;
  isPaused = false;
  SortedAnimation();
}

async function selectionSort() {
  for (let i = 0; i < n - 1; i++) {
    let minIndex = i;
    for (let j = i + 1; j < n; j++) {
      if (isStopped) {
        draw([], []);
        return;
      }
      if (!isPaused) {
        if (heights[j] < heights[minIndex]) {
          minIndex = j;
        }
        draw([i, j, minIndex], ['blue', 'red', 'green']);
      } else {
        j--;
      }
      await sleep(delay);
    }
    swap(i, minIndex);
  }
  console.log('Selection sort completed.');
  draw([], []);
  isSorted = true;
  isStopped = true;
  isPaused = false;
  SortedAnimation();
}

async function insertionSort() {
  for (let i = 0; i < n; i++) {
    let key = heights[i];
    for (let j = i - 1; j >= 0 && heights[j] > key; j--) {
      if (isStopped) {
        draw([], []);
        return;
      }
      if (!isPaused) {
        swap(j, j + 1);
        draw([j, i + 1], ['green', 'red']);
      } else {
        j++;
      }
      await sleep(delay);
    }
  }
  console.log('Insertion sort completed.');
  draw([], []);
  isSorted = true;
  isStopped = true;
  isPaused = false;
  SortedAnimation();
}

async function mergeSort() {
  for (let curSize = 1; curSize < n; curSize *= 2) {
    for (let start = 0; start < n - 1; start += 2 * curSize) {
      let mid = Math.min(start + curSize - 1, n - 1);
      let end = Math.min(start + 2 * curSize - 1, n - 1);
      let n1 = mid - start + 1;
      let n2 = end - mid;
      let L = [],
        R = [];
      for (let i = 0; i < n1; i++) L.push(heights[start + i]);
      for (let j = 0; j < n2; j++) R.push(heights[mid + 1 + j]);
      let i = 0,
        j = 0,
        k = start;

      let barsIndices = [];
      let barsColors = [];
      for (let i1 = start; i1 <= end; i1++) {
        barsIndices.push(i1);
        barsColors.push('yellow');
      }

      while (i < n1 || j < n2) {
        if (isStopped) {
          draw([], []);
          return;
        }
        if (!isPaused) {
          if (j == n2 || (i < n1 && L[i] <= R[j])) {
            draw([k, ...barsIndices], ['green', ...barsColors]);
            i++;
          } else {
            for (let i1 = mid + 1 + j; i1 > k; i1--) {
              swap(i1, i1 - 1);
            }
            draw([k, ...barsIndices], ['green', ...barsColors]);
            j++;
          }
          k++;
        }
        await sleep(delay);
      }
    }
  }
  console.log('Merge sort completed.');
  draw([], []);
  isSorted = true;
  isStopped = true;
  isPaused = false;
  SortedAnimation();
}

async function quickSort() {
  let s = new Stack();
  s.push(0);
  s.push(n - 1);
  while (!s.isEmpty()) {
    let h = s.pop();
    let l = s.pop();

    let i = l - 1;

    let barsIndices = [];
    let barsColors = [];
    for (let i1 = l; i1 <= h; i1++) {
      barsIndices.push(i1);
      barsColors.push('yellow');
    }

    for (let j = l; j <= h - 1; j++) {
      if (isStopped) {
        draw([], []);
        return;
      }
      if (!isPaused) {
        draw([i, j, ...barsIndices], ['green', 'red', ...barsColors]);
        if (heights[j] <= heights[h]) {
          i++;
          swap(i, j);
        }
      } else {
        j--;
      }
      await sleep(delay);
    }
    swap(i + 1, h);
    let partition = i + 1;
    if (l < partition - 1) {
      s.push(l);
      s.push(partition - 1);
    }
    if (partition + 1 < h) {
      s.push(partition + 1);
      s.push(h);
    }
  }
  console.log('Quick sort completed.');
  draw([], []);
  isSorted = true;
  isStopped = true;
  isPaused = false;
  SortedAnimation();
}

// when slider value is changed generate new bars and update the value of bar count on the navbar.
barSlider.oninput = () => {
  document.querySelector('.sliderValue').innerHTML = `Bars: ${barSlider.value}`;
  generateRandomArray();
};
speedSlider.oninput = () => {
  delay = 375 - speedSlider.value;
};

document.getElementById('generateButton').addEventListener('click', generateRandomArray);
document.getElementById('sortButton').addEventListener('click', () => {
  // get the name of selected sorting algorithm.
  type = document.getElementById('sort_type').value;

  // if there is another sorting visualization going on then return from the function.
  if (!isStopped) return;
  // if recently we used visualization and bars are sorted then generate new unsorted array.
  if (isSorted || !isGenerated) generateRandomArray();

  isGenerated = false;
  isPaused = false;
  isStopped = false;

  if (type == 'bubble') bubbleSort();
  else if (type == 'selection') selectionSort();
  else if (type == 'insertion') insertionSort();
  else if (type == 'merge') mergeSort();
  else if (type == 'quick') quickSort();
});
document.getElementById('stopButton').addEventListener('click', () => {
  isStopped = true;
  isPaused = false;
  document.getElementById('pauseButton').innerHTML = 'Pause';
  // if user presses stop button and random bars is not generated then generate rnadom bars.
  if (!isGenerated && !isSorted) generateRandomArray();
});

document.getElementById('pauseButton').addEventListener('click', () => {
  // if currently sorting is in progress then isStopped will be false.
  if (!isStopped) {
    // toggle button between pause and resume
    if (isPaused) {
      document.getElementById('pauseButton').innerHTML = 'Pause';
      isPaused = false;
    } else {
      document.getElementById('pauseButton').innerHTML = 'Resume';
      isPaused = true;
    }
  }
});
