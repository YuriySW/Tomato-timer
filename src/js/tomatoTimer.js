class TomatoTimer {
  constructor(config = {}) {
    this.times = {
      work: (config.workTime || 25) * 60 * 1000,
      shortBreak: (config.shortBreak || 5) * 60 * 1000,
      longBreak: (config.longBreak || 15) * 60 * 1000,
    };

    this.tasks = config.tasks || [];
    this.activeTask = null;
    this.currentTimer = null;
  }

  // Добавить задачу
  addTask(task) {
    const newTask = {
      id: task.id || Date.now(),
      name: task.name || 'Новая задача',
      counter: 0,
      completed: false,
    };

    this.tasks.push(newTask);
    console.log(`Задача "${newTask.name}" добавлена (ID: ${newTask.id})`);
    return newTask;
  }

  // Активировать задачу
  activateTask(taskId) {
    const task = this.tasks.find((t) => t.id === taskId);

    if (!task) {
      console.error(`Задача с ID ${taskId} не найдена`);
      return;
    }

    this.activeTask = task;
    console.log(`Активирована задача: "${task.name}" (Помодоро: ${task.counter})`);
    return task;
  }

  // Запустить задачу
  startTask() {
    try {
      if (!this.activeTask) {
        throw new Error('Нет активной задачи. Сначала активируйте задачу методом activateTask()');
      }

      console.log(`Начало работы над задачей: "${this.activeTask.name}"`);
      console.log(`Время работы: ${this.times.work / 60000} минут`);

      this.runTimer(this.times.work, () => {
        console.log(`Помодоро завершён для задачи: "${this.activeTask.name}"`);

        // Увеличиваем счетчик
        this.incrementCounter(this.activeTask.id);

        // Определяем тип перерыва
        const isLongBreak = this.activeTask.counter % 4 === 0;
        const breakTime = isLongBreak ? this.times.longBreak : this.times.shortBreak;
        const breakType = isLongBreak ? 'длинный' : 'короткий';

        console.log(`Начинается ${breakType} перерыв (${breakTime / 60000} минут)`);

        this.runTimer(breakTime, () => {
          console.log(`Перерыв окончен! Готовы к следующему помодоро?`);
          console.log(
            `Статистика задачи "${this.activeTask.name}": ${this.activeTask.counter} помодоро завершено\n`
          );
        });
      });
    } catch (error) {
      console.error(`Ошибка: ${error.message}`);
    }
  }

  // Увеличить счетчик у задачи
  incrementCounter(taskId) {
    const task = this.tasks.find((t) => t.id === taskId);

    if (!task) {
      console.error(`Задача с ID ${taskId} не найдена`);
      return;
    }

    task.counter++;
    console.log(`Счетчик задачи "${task.name}" увеличен до ${task.counter}`);
    return task.counter;
  }

  // Вспомогательный метод для запуска таймера
  runTimer(duration, callback) {
    if (this.currentTimer) {
      clearTimeout(this.currentTimer);
    }

    this.currentTimer = setTimeout(callback, duration);
  }

  // Остановить текущий таймер
  stopTimer() {
    if (this.currentTimer) {
      clearTimeout(this.currentTimer);
      this.currentTimer = null;
      console.log('Таймер остановлен');
    }
  }

  // Получить информацию о всех задачах
  getTasks() {
    return this.tasks;
  }

  // Получить статистику по задаче
  getTaskStats(taskId) {
    const task = this.tasks.find((t) => t.id === taskId);
    if (task) {
      console.log(`Статистика задачи "${task.name}":`);
      console.log(`ID: ${task.id}`);
      console.log(`Завершено помодоро: ${task.counter}`);
      console.log(`Статус: ${task.completed ? 'Завершена' : 'В процессе'}\n`);
      return task;
    }
    console.error(`Задача с ID ${taskId} не найдена`);
  }
}

const timer = new TomatoTimer({
  workTime: 0.1,
  shortBreak: 0.05,
  longBreak: 0.08,
});

const task1 = timer.addTask({name: 'Изучить JavaScript'});
const task2 = timer.addTask({name: 'Написать документацию'});

console.log('Список задач:', timer.getTasks());

timer.activateTask(task1.id);
timer.startTask();
