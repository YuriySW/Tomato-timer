class TomatoTask {
  #name;
  #count;
  #id;

  constructor(name, count = 0) {
    if (typeof name === 'string' && name.trim() !== '') {
      this.#name = name;
      this.#count = count;
      this.#id = Array.from(
        {length: 8},
        () =>
          'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'[
            Math.floor(Math.random() * 62)
          ]
      ).join('');
    } else {
      console.log('Название должно быть String!');
      return;
    }
  }

  addCount() {
    this.#count += 1;
  }

  changeName(newName) {
    if (typeof newName === 'string' && newName.trim() !== '') {
      this.#name = newName;
    } else {
      console.log('Название должно быть String!');
      return;
    }
  }

  getObj() {
    return {
      id: this.#id,
      name: this.#name,
      count: this.#count,
    };
  }
}

const timer = new TomatoTask('Бег');
console.log(timer.getObj());
timer.addCount();
console.log(timer.getObj());

timer.changeName('Плавание');
console.log(timer.getObj());

const work = new TomatoTask('Работа');
timer.addCount();
console.log(work.getObj());
