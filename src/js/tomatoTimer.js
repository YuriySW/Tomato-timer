// ============= TASK CLASSES =============

class Task {
  constructor(text) {
    this.id = this.generateId();
    this.text = text;
    this.count = 0;
    this.importance = 'default';
  }

  generateId() {
    return Date.now() + Math.random().toString(36).substr(2, 9);
  }

  increment() {
    this.count++;
  }
}

class ImportantTask extends Task {
  constructor(text) {
    super(text);
    this.importance = 'important';
  }
}

class StandardTask extends Task {
  constructor(text) {
    super(text);
    this.importance = 'so-so';
  }
}

class UnimportantTask extends Task {
  constructor(text) {
    super(text);
    this.importance = 'default';
  }
}

// ============= TOMATO TIMER (SINGLETON) =============

class TomatoTimer {
  static instance = null;

  constructor(config = {}) {
    if (TomatoTimer.instance) {
      return TomatoTimer.instance;
    }

    this.times = {
      work: (config.workTime || 25) * 60 * 1000,
      shortBreak: (config.shortBreak || 5) * 60 * 1000,
      longBreak: (config.longBreak || 15) * 60 * 1000,
    };

    this.tasks = [];
    this.activeTask = null;
    this.timerState = 'stopped';
    this.timeLeft = this.times.work;
    this.timerInterval = null;
    this.onTimerUpdate = null;

    TomatoTimer.instance = this;
  }

  addTask(task) {
    this.tasks.push(task);
    return task;
  }

  removeTask(taskId) {
    const index = this.tasks.findIndex((t) => t.id === taskId);
    if (index !== -1) {
      if (this.activeTask && this.activeTask.id === taskId) {
        this.stopTimer();
        this.activeTask = null;
      }
      this.tasks.splice(index, 1);
    }
  }

  editTask(taskId, newText) {
    const task = this.tasks.find((t) => t.id === taskId);
    if (task && newText.trim()) {
      task.text = newText.trim();
      return task;
    }
  }

  activateTask(taskId) {
    const task = this.tasks.find((t) => t.id === taskId);
    if (task) {
      const wasRunning = this.timerState !== 'stopped';
      if (wasRunning) {
        this.stopTimer();
      }
      this.activeTask = task;
      this.timeLeft = this.times.work;
      this.timerState = 'stopped';
      return task;
    }
  }

  startTimer() {
    if (!this.activeTask) return;

    if (this.timerState === 'stopped') {
      this.timerState = 'work';
      this.timeLeft = this.times.work;
    }

    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }

    this.timerInterval = setInterval(() => {
      this.timeLeft -= 1000;

      if (this.timeLeft <= 0) {
        this.onTimerComplete();
      }

      if (this.onTimerUpdate) {
        this.onTimerUpdate();
      }
    }, 1000);
  }

  stopTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
    this.timerState = 'stopped';
    this.timeLeft = this.times.work;
  }

  onTimerComplete() {
    clearInterval(this.timerInterval);
    this.timerInterval = null;

    if (this.timerState === 'work') {
      this.activeTask.increment();

      const isLongBreak = this.activeTask.count % 4 === 0;
      this.timeLeft = isLongBreak ? this.times.longBreak : this.times.shortBreak;
      this.timerState = 'break';

      this.playSound();

      if (this.onTimerUpdate) {
        this.onTimerUpdate();
      }

      this.startTimer();
    } else if (this.timerState === 'break') {
      this.timeLeft = this.times.work;
      this.timerState = 'stopped';
      this.playSound();

      if (this.onTimerUpdate) {
        this.onTimerUpdate();
      }
    }
  }

  playSound() {
    const audio = new Audio(
      'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBjeP1fPPfC4GKXzJ8N+UQgwhZrjq66lXFwxJoeHyvWwhBjeO1fPPey4GKXvH79+UQgsfZrfp66lXGAxIouDyvWwhBjaO1fPPey4FKHvH79+UQQsfZrbp66hWGAxIot/yvWsgBjaO1PPPey0FJ3vH79+TQQoeZrbp66hWFwxIot/xvWsgBTWO1PPPei0FJ3rG79+TQQoeZbbp66lWFwxIot/xvWsfBTWN1PPPei0FJ3rG79+TQQoeZbbp66hWFwxGod/xvWsfBTSN1PLPei0EJ3nG79+TQQoeZLbq66hWFgxGod/xvWsfBTSN1PLPeiwEJ3nG79+SQAoeZLbq66lWFwxGod/xvWsfBTON1PLPeiwEJ3nF79+SQAocZLbq66lWFgxGn9/xvWsfBTON1PLPeiwEJnnF79+SQAocZLbq66lWFgxGn9/wvWofBTKN1PLOeiwEJnnF79+SPwoaZLbq66lWFgxGnt/wvWsfBS+N1PLOeivEJXjE79+SPwkaZbbq66lWFgxGnuDwvWofBS+M1PLOeivEJXjE79+SPgkaZbbq66lWFQxGnuDwvWofBS+M1PLOeivEJHjE79+SPgkaZbbq66lWFQxGnuDwvWofBS+M1PLOeivEI3jE79+SPgkaZbbq66lWFQxGnuDwvWofBS+M1PLOeivEI3jE79+SPgkaZbbq66lWFQxGnuDwvWofBS+M1PLOeivEI3jE79+SPgkaZbbq66lWFQxGnuDwvWofBS+M1PLOeivEI3jE79+SPgkaZbbq66lWFQxGnuDwvWofBS6M1PLOeivEI3jE79+SPgkaZbbq66lWFQxGnuDwvWofBS6M1PLOeivEI3jE79+SPgkaZbbq66lWFQxGnuDwvWofBS6M1PLOeivEI3jE79+SPgkaZbbq66lWFQxGnuDwvWofBS6M1PLOeivEI3jE79+SPgkaZbbq66lWFQxGnuDwvWofBS6M1PLOeivEI3jE79+SPgkaZbbq66lWFQxGnuDwvWofBS6M1PLOeivEI3jE79+SPgkaZbbq66lWFQxGnuDwvWofBS6M1PLOeivEI3jE79+SPgkaZbbq66lWFQxGnuDwvWofBS6M1PLOeivEI3jE79+SPgkaZbbq66lWFQxGnuDwvWofBS6M1PLOeivEI3jE79+SPgkaZbbq66lWFQxGnuDwvWofBS6M1PLOeivEI3jE79+SPgkaZbbq66lWFQxGnuDwvWofBS6M1PLOeivEI3jE79+SPgkaZbbq66lWFQxGnuDwvWofBS6M1PLOeivEI3jE79+SPgkaZbbq66lWFQxGnuDwvWofBS6M1PLOeivEI3jE79+SPgkaZbbq66lWFQxGnuDwvWofBS6M1PLOeivEI3jE79+SPgkaZbbq66lWFQ=='
    );
    audio.play().catch(() => {});
  }

  getTimeLeft() {
    return this.timeLeft;
  }

  getTotalTime() {
    const minutes = this.tasks.reduce((total, task) => total + task.count * 25, 0);
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return {hours, minutes: mins};
  }

  isRunning() {
    return this.timerInterval !== null;
  }
}

// ============= RENDER TOMATO =============

class RenderTomato {
  constructor() {
    this.windowPanel = document.querySelector('.window__panel-title');
    this.windowTaskText = document.querySelector('.window__panel-task-text');
    this.timerText = document.querySelector('.window__timer-text');
    this.tasksList = document.querySelector('.tasks__list');
    this.tasksDeadline = document.querySelector('.tasks__deadline');
    this.startButton = document.querySelector('.button-primary:not(.task-form__add-button)');
    this.stopButton = document.querySelector('.button-secondary');
    this.taskForm = document.querySelector('.task-form');
    this.taskInput = document.querySelector('#task-name');
    this.importanceButton = document.querySelector('.button-importance');
    this.modalOverlay = document.querySelector('.modal-overlay');
    this.modalDeleteButton = document.querySelector('.modal-delete__delete-button');
    this.modalCancelButton = document.querySelector('.modal-delete__cancel-button');
    this.modalCloseButton = document.querySelector('.modal-delete__close-button');

    this.currentImportance = 'default';
    this.taskToDelete = null;
  }

  renderActiveTask(task) {
    if (task) {
      this.windowPanel.textContent = task.text;
      this.windowTaskText.textContent = `Томат ${task.count + 1}`;
    } else {
      this.windowPanel.textContent = 'Выберите задачу';
      this.windowTaskText.textContent = '';
    }
  }

  renderTimer(milliseconds) {
    const minutes = Math.floor(milliseconds / 60000);
    const seconds = Math.floor((milliseconds % 60000) / 1000);
    this.timerText.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(
      2,
      '0'
    )}`;
  }

  renderTasks(tasks, activeTaskId) {
    this.tasksList.innerHTML = '';

    tasks.forEach((task) => {
      const li = document.createElement('li');
      li.className = `tasks__item ${task.importance}`;
      li.dataset.taskId = task.id;

      const countSpan = document.createElement('span');
      countSpan.className = 'count-number';
      countSpan.textContent = task.count;

      const textButton = document.createElement('button');
      textButton.className = 'tasks__text';
      if (task.id === activeTaskId) {
        textButton.classList.add('tasks__text_active');
      }
      textButton.textContent = task.text;
      textButton.dataset.originalText = task.text;

      const menuButton = document.createElement('button');
      menuButton.className = 'tasks__button';

      const popup = document.createElement('div');
      popup.className = 'popup';

      const editButton = document.createElement('button');
      editButton.className = 'popup__button popup__edit-button';
      editButton.textContent = 'Редактировать';

      const deleteButton = document.createElement('button');
      deleteButton.className = 'popup__button popup__delete-button';
      deleteButton.textContent = 'Удалить';

      popup.appendChild(editButton);
      popup.appendChild(deleteButton);

      li.appendChild(countSpan);
      li.appendChild(textButton);
      li.appendChild(menuButton);
      li.appendChild(popup);

      this.tasksList.appendChild(li);
    });
  }

  renderTotalTime(hours, minutes) {
    if (hours > 0) {
      this.tasksDeadline.textContent = `${hours} час${hours > 1 ? 'а' : ''} ${minutes} мин`;
    } else if (minutes > 0) {
      this.tasksDeadline.textContent = `${minutes} мин`;
    } else {
      this.tasksDeadline.textContent = '0 мин';
    }
  }

  toggleTimerButtons(isRunning) {
    if (isRunning) {
      this.startButton.classList.add('hidden');
      this.stopButton.classList.remove('hidden');
    } else {
      this.startButton.classList.remove('hidden');
      this.stopButton.classList.add('hidden');
    }
  }

  toggleImportance() {
    const importances = ['default', 'so-so', 'important'];
    const currentIndex = importances.indexOf(this.currentImportance);
    this.currentImportance = importances[(currentIndex + 1) % 3];

    this.importanceButton.className = `button button-importance ${this.currentImportance}`;
  }

  showModal(taskId) {
    this.taskToDelete = taskId;
    this.modalOverlay.style.display = 'flex';
  }

  hideModal() {
    this.taskToDelete = null;
    this.modalOverlay.style.display = 'none';
  }

  clearTaskInput() {
    this.taskInput.value = '';
    this.currentImportance = 'default';
    this.importanceButton.className = 'button button-importance default';
  }
}

// ============= CONTROLLER TOMATO =============

class ControllerTomato {
  constructor(model, view) {
    this.model = model;
    this.view = view;

    this.init();
  }

  init() {
    // Очищаем начальный HTML контент
    this.view.tasksList.innerHTML = '';
    this.view.windowPanel.textContent = 'Выберите задачу';
    this.view.windowTaskText.textContent = '';
    this.view.tasksDeadline.textContent = '0 мин';

    this.view.renderTimer(this.model.getTimeLeft());
    this.updateView();
    this.attachEventListeners();

    this.model.onTimerUpdate = () => {
      this.updateView();
    };
  }

  attachEventListeners() {
    this.view.startButton.addEventListener('click', () => this.handleStart());
    this.view.stopButton.addEventListener('click', () => this.handleStop());

    this.view.taskForm.addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleAddTask();
    });

    this.view.importanceButton.addEventListener('click', (e) => {
      e.preventDefault();
      this.view.toggleImportance();
    });

    this.view.tasksList.addEventListener('click', (e) => {
      const taskItem = e.target.closest('.tasks__item');
      if (!taskItem) return;

      const taskId = taskItem.dataset.taskId;

      if (e.target.classList.contains('tasks__text')) {
        this.handleActivateTask(taskId);
      } else if (e.target.classList.contains('tasks__button')) {
        e.stopPropagation();
        this.handleTogglePopup(taskItem);
      } else if (e.target.classList.contains('popup__delete-button')) {
        e.stopPropagation();
        this.view.showModal(taskId);
        this.closeAllPopups();
      } else if (e.target.classList.contains('popup__edit-button')) {
        e.stopPropagation();
        this.handleEditTask(taskItem, taskId);
        this.closeAllPopups();
      }
    });

    this.view.modalDeleteButton.addEventListener('click', () => {
      if (this.view.taskToDelete) {
        this.handleDeleteTask(this.view.taskToDelete);
        this.view.hideModal();
      }
    });

    this.view.modalCancelButton.addEventListener('click', () => {
      this.view.hideModal();
    });

    this.view.modalCloseButton.addEventListener('click', () => {
      this.view.hideModal();
    });

    this.view.modalOverlay.addEventListener('click', (e) => {
      if (e.target === this.view.modalOverlay) {
        this.view.hideModal();
      }
    });

    document.addEventListener('click', (e) => {
      if (!e.target.closest('.tasks__item')) {
        this.closeAllPopups();
      }
    });
  }

  handleStart() {
    if (!this.model.activeTask) {
      alert('Выберите задачу из списка');
      return;
    }

    this.model.startTimer();
    this.view.toggleTimerButtons(true);
  }

  handleStop() {
    this.model.stopTimer();
    this.view.toggleTimerButtons(false);
    this.updateView();
  }

  handleAddTask() {
    const text = this.view.taskInput.value.trim();
    if (!text) return;

    let task;
    switch (this.view.currentImportance) {
      case 'important':
        task = new ImportantTask(text);
        break;
      case 'so-so':
        task = new StandardTask(text);
        break;
      default:
        task = new UnimportantTask(text);
    }

    this.model.addTask(task);
    this.view.clearTaskInput();
    this.updateView();
  }

  handleActivateTask(taskId) {
    this.model.activateTask(taskId);
    this.view.toggleTimerButtons(false);
    this.updateView();
  }

  handleDeleteTask(taskId) {
    this.model.removeTask(taskId);
    this.updateView();
  }

  handleEditTask(taskItem, taskId) {
    const textButton = taskItem.querySelector('.tasks__text');
    const originalText = textButton.textContent;

    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'task-name input-primary';
    input.value = originalText;
    input.style.width = '100%';
    input.style.padding = '8px';

    textButton.style.display = 'none';
    taskItem.insertBefore(input, textButton);
    input.focus();
    input.select();

    const saveEdit = () => {
      const newText = input.value.trim();
      if (newText && newText !== originalText) {
        this.model.editTask(taskId, newText);
      }
      this.updateView();
    };

    const cancelEdit = () => {
      this.updateView();
    };

    input.addEventListener('blur', saveEdit);
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        saveEdit();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        cancelEdit();
      }
    });
  }

  handleTogglePopup(taskItem) {
    const popup = taskItem.querySelector('.popup');
    const isActive = popup.classList.contains('popup_active');

    this.closeAllPopups();

    if (!isActive) {
      popup.classList.add('popup_active');
    }
  }

  closeAllPopups() {
    document.querySelectorAll('.popup').forEach((p) => {
      p.classList.remove('popup_active');
    });
  }

  updateView() {
    const activeTaskId = this.model.activeTask ? this.model.activeTask.id : null;
    this.view.renderTasks(this.model.tasks, activeTaskId);
    this.view.renderActiveTask(this.model.activeTask);
    this.view.renderTimer(this.model.getTimeLeft());

    const {hours, minutes} = this.model.getTotalTime();
    this.view.renderTotalTime(hours, minutes);
  }
}

// ============= INITIALIZATION =============

document.addEventListener('DOMContentLoaded', () => {
  const timer = new TomatoTimer({
    workTime: 25,
    shortBreak: 5,
    longBreak: 15,
  });

  const view = new RenderTomato();
  const controller = new ControllerTomato(timer, view);
});
