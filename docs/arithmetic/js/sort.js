console.log('--------------------------插入排序start-------------------------------');
var arr1 = [4, 2, 1, 8, 10, 24, 16, 15, 141, 18, 40, 39, 38, 37, 36, 35, 34, 42, 47, 49, 60, 59, 57, 58];
function insertSort(arr) {
  var start = Date.now();
  for(var i = 1; i < arr.length; i++) {
    var j = i;
    var compareVal = arr[i];
    while(j > 0 && arr[j - 1] > compareVal) {
      arr[j] = arr[j - 1];
      j--;
    }
    arr[j] = compareVal;
  }
  var end = Date.now();
  var seconds = end -start;
  console.log('历时多少毫秒：'+ seconds);
  return arr;
}
console.log('插入排序', insertSort(arr1))
console.log('--------------------------冒泡排序start-------------------------------');
var arr2 = [4, 2, 1, 8, 10, 24, 16, 15, 141, 18, 40, 39, 38, 37, 36, 35, 34, 42, 47, 49, 60, 59, 57, 58];
function bubbleSort(arr) {
  var start = Date.now();
  for(var i = 0; i < arr.length; i++) {
    for(j = 0; j < arr.length; j++) {
      if(arr[j] > arr[j + 1]) {
        var temp = arr[j + 1];
        arr[j + 1] = arr[j];
        arr[j] = temp
      }
    }
  }
  var end = Date.now();
  var seconds = end -start;
  console.log('历时多少毫秒：'+ seconds);
  return arr;
}
console.log('冒泡排序', bubbleSort(arr2));

console.log('--------------------------希尔排序start-------------------------------');
var arr3 = [4, 2, 1, 8, 10, 24, 16, 15, 141, 18, 40, 39, 38, 37, 36, 35, 34, 42, 47, 49, 60, 59, 57, 58];
function shellSort(arr) {
  var len = arr.length;
  for(var gap = len >>> 1; gap > 0; gap = gap >>> 1) {
    for(var i = gap; i < len; i++) {
      var temp = arr[i];
      for(var j = i; j >= 0 && arr[j - gap] > temp; j -= gap) {
        arr[j] = arr[j - gap];
      }
      arr[j] = temp;
    }
  }
  return arr;
}
console.log('希尔排序', shellSort(arr3));

console.log('--------------------------快排start-------------------------------');
var arr4 = [4, 2, 1, 8, 10, 24, 16, 15, 141, 18, 40, 39, 38, 37, 36, 35, 34, 42, 47, 49, 60, 59, 57, 58];
function quickSort(arr) {

  function partition(arr, left, right) {
    var pivot = arr[right];
    var storeIndex = left;
    for(var i = left; i < right; i++) {
      if(arr[i] < pivot) {

      }
    }
  }
}
console.log('快速排序', quickSort(arr4));
