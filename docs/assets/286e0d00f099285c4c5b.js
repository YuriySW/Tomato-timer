var count = 0;
var imp = ['default', 'important', 'so-so'];
document.querySelector('.button-importance').addEventListener('click', function (_ref) {
  var target = _ref.target;
  count += 1;
  if (count >= imp.length) {
    count = 0;
  }
  for (var i = 0; i < imp.length; i++) {
    if (count === i) {
      target.classList.add(imp[i]);
    } else {
      target.classList.remove(imp[i]);
    }
  }
});