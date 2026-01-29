// Data Management
const INITIAL_TASKS = [
  { id: 1, title: 'Quantum Debugging', description: 'Analyze the neural network for semantic inconsistencies.', unlocked: true, completed: false, questions: [{ q: "What is the primary objective of Task 1?", a: "Debug" }] },
  { id: 2, title: 'Neural Reconfiguration', description: 'Rewire the cognitive pathways to optimize data flow.', unlocked: false, completed: false, questions: [{ q: "What tool is used for Task 2?", a: "Reconfig" }] },
  { id: 3, title: 'Cerebral Breach', description: 'Final synchronization of the biological and synthetic interfaces.', unlocked: false, completed: false, questions: [{ q: "Final step of Task 3?", a: "Sync" }] }
];

const state = {
  user: null, // { name: '', isAdmin: false }
  tasks: JSON.parse(localStorage.getItem('btb_tasks')) || INITIAL_TASKS,
  users: JSON.parse(localStorage.getItem('btb_users')) || [],
  currentView: 'login' // login, welcome, home, task, admin
};

// Particles init
const initParticles = () => {
  const container = document.createElement('div');
  container.className = 'particles';
  document.body.appendChild(container);

  for (let i = 0; i < 20; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    const size = Math.random() * 5 + 2;
    p.style.width = `${size}px`;
    p.style.height = `${size}px`;
    p.style.left = `${Math.random() * 100}vw`;
    p.style.top = `${Math.random() * 100}vh`;
    p.style.animationDelay = `${Math.random() * 20}s`;
    p.style.animationDuration = `${Math.random() * 10 + 10}s`;
    container.appendChild(p);
  }
};
initParticles();

const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
const playSound = window.playSound = (freq = 440, type = 'sine', duration = 0.1) => {
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
  gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.start();
  osc.stop(audioCtx.currentTime + duration);
};

const saveState = () => {
  localStorage.setItem('btb_tasks', JSON.stringify(state.tasks));
  localStorage.setItem('btb_users', JSON.stringify(state.users));
};

// Routing & View Rendering
const app = document.getElementById('app');

const render = (viewName, params = {}) => {
  const currentContainer = document.querySelector('.view-container');
  const scanner = document.getElementById('global-scan');

  const proceedWithRender = () => {
    if (scanner) scanner.style.display = 'none';
    state.currentView = viewName;

    // Clear the app first
    app.innerHTML = '';

    // Handle loader on first run
    const loader = document.getElementById('loader-container');
    if (loader) {
      setTimeout(() => {
        loader.style.opacity = '0';
        setTimeout(() => loader.remove(), 500);
      }, 1000);
    }

    switch (viewName) {
      case 'login': renderLogin(); break;
      case 'welcome': renderWelcome(); break;
      case 'home': renderHome(); break;
      case 'task': renderTask(params.taskId); break;
      case 'admin': renderAdmin(); break;
      case 'success': renderSuccess(); break;
    }
  };

  if (currentContainer && state.currentView !== viewName) {
    if (scanner) scanner.style.display = 'block';
    currentContainer.classList.add('page-exit');
    setTimeout(proceedWithRender, 400);
  } else {
    proceedWithRender();
  }
};

const renderLogin = () => {
  app.innerHTML = `
    <div class="view-container">
      <div class="login-card glass">
        <h1 class="brand-logo">BUG TO BRAIN</h1>
        <p class="card-subtitle">Authorize your neural interface</p>
        <form id="login-form">
          <div class="input-group">
            <label class="input-label">Username</label>
            <input type="text" id="username" class="form-input" placeholder="Enter your identify" required autocomplete="off">
          </div>
          <div class="input-group">
            <label class="input-label">Access Code</label>
            <div class="password-wrapper">
              <input type="password" id="password" class="form-input" placeholder="••••••••" required>
              <button type="button" class="eye-btn" id="toggle-password">👁️</button>
            </div>
          </div>
          <div id="login-error" style="color: var(--accent-neon); margin-bottom: 15px; font-size: 0.8rem; display: none;">Invalid access code</div>
          <button type="submit" class="btn-primary" style="width: 100%;">Initiate Login</button>
        </form>
      </div>
    </div>
  `;

  document.getElementById('login-form').onsubmit = (e) => {
    e.preventDefault();
    const name = document.getElementById('username').value;
    const pass = document.getElementById('password').value;

    if (name === 'Admin18' && pass === 'Admin@1805') {
      playSound(880, 'square');
      state.user = { name, isAdmin: true };
      render('admin');
    } else if (pass === 'Tech2k26') {
      playSound(660);
      state.user = { name, isAdmin: false };

      // Upsert user in storage
      let existingUser = state.users.find(u => u.name === name);
      if (!existingUser) {
        state.users.push({ name, tasksCompleted: 0, progress: '0%', lastActive: new Date().toISOString() });
        saveState();
      }

      render('welcome');
    } else {
      document.getElementById('login-error').style.display = 'block';
    }
  };

  document.getElementById('toggle-password').onclick = (e) => {
    const input = document.getElementById('password');
    const isPass = input.type === 'password';
    input.type = isPass ? 'text' : 'password';
    e.target.innerText = isPass ? '🔒' : '👁️';
  };
};

const renderWelcome = () => {
  app.innerHTML = `
    <div class="view-container">
      <div class="welcome-screen">
        <h1 class="welcome-msg gradient-text" style="font-weight: 800; letter-spacing: -1px;">Welcome to our game –<br>Bug to Brain</h1>
        <p style="margin-top: 20px; color: var(--accent-primary); font-family: var(--font-mono); font-size: 0.8rem; letter-spacing: 4px; animation: glitch 1s infinite;">SYNCHRONIZING NEURAL INTERFACE...</p>
      </div>
    </div>
  `;

  setTimeout(() => {
    render('home');
  }, 4000);
};

const renderHome = () => {
  app.innerHTML = `
    <div class="view-container">
      <div class="home-container">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px;">
          <div>
            <h1 style="font-size: 2.5rem; font-weight: 800;">COMMAND CENTER</h1>
            <p style="color: var(--text-secondary);">Welcome, <span style="color: var(--accent-primary);">${state.user.name}</span></p>
          </div>
          <button class="btn-secondary" onclick="location.reload()">Logout</button>
        </div>
        
        <div class="task-grid">
          ${state.tasks.map(task => `
            <div class="task-card glass ${!task.unlocked ? 'locked' : ''}" onclick="playSound(400); window.openTask(${task.id})">
              ${!task.unlocked ? '<span class="lock-icon">🔒</span>' : `<span class="task-icon">${getTaskIcon(task.id)}</span>`}
              <h2 class="task-title">${task.title}</h2>
              <p style="color: var(--text-secondary); margin-bottom: 20px;">${task.description}</p>
              ${task.completed ? '<span style="color: var(--accent-primary); font-weight: 700;">[ COMPLETED ]</span>' : ''}
              ${task.unlocked && !task.completed ? '<button class="btn-primary" style="margin-top: 15px;">Open Task →</button>' : ''}
              ${task.completed ? '<div style="margin-top: 15px; color: var(--accent-primary); font-weight: 700; text-transform: uppercase; letter-spacing: 2px;">Data Synced</div>' : ''}
              ${!task.unlocked ? '<p style="font-size: 0.8rem; color: var(--accent-neon); margin-top: 15px;">ACCESS DENIED: Complete Previous Node</p>' : ''}
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;
};

const getTaskIcon = (id) => {
  const icons = ['⚡', '🧬', '🧠'];
  return icons[id - 1] || '👾';
};

window.openTask = (id) => {
  const task = state.tasks.find(t => t.id === id);
  if (task.unlocked) {
    render('task', { taskId: id });
  }
};

const renderTask = (id) => {
  const task = state.tasks.find(t => t.id === id);
  app.innerHTML = `
    <div class="view-container">
      <div class="task-detail glass">
        <div class="back-btn" onclick="window.renderHome()">
          <span>←</span> Back to Command Center
        </div>
        <h1 style="font-size: 2.5rem; margin-bottom: 20px;" class="gradient-text">${task.title}</h1>
        <p style="color: var(--text-secondary); margin-bottom: 40px; font-size: 1.1rem;">${task.description}</p>
        
        <div class="questions-section">
          ${task.questions.map((q, idx) => `
            <div style="margin-bottom: 30px; padding: 25px; background: rgba(0, 242, 255, 0.02); border-radius: 12px; border: 1px solid var(--glass-border); transition: 0.3s;" class="question-box">
              <h3 style="margin-bottom: 15px; color: var(--accent-primary); font-family: var(--font-mono); font-size: 0.9rem;">[ CHALLENGE_CODE_${idx + 101} ]</h3>
              <p style="margin-bottom: 20px; font-size: 1.1rem; line-height: 1.6; white-space: pre-wrap; font-family: var(--font-mono); background: rgba(0,0,0,0.2); padding: 15px; border-radius: 8px;">${q.q}</p>
              <div style="position: relative;">
                <input type="text" class="form-input answer-input" data-idx="${idx}" placeholder="Type your solution here..." style="font-family: var(--font-mono);">
                <div class="feedback" style="margin-top: 10px; font-size: 0.8rem; display: none;"></div>
              </div>
            </div>
          `).join('')}
        </div>

        <div style="display: flex; gap: 20px; margin-top: 50px;">
          <button class="btn-primary" onclick="window.validateTask(${id})">Submit Neural Link</button>
        </div>
      </div>
    </div>
  `;
};

window.validateTask = (id) => {
  const task = state.tasks.find(t => t.id === id);
  const inputs = document.querySelectorAll('.answer-input');
  let allCorrect = true;

  inputs.forEach(input => {
    const idx = parseInt(input.dataset.idx);
    const feedback = input.nextElementSibling;
    const q = task.questions[idx];

    if (input.value.trim().toLowerCase() === q.a.toLowerCase()) {
      feedback.innerHTML = "✓ SOLUTION MATCHED";
      feedback.style.color = "var(--accent-primary)";
      feedback.style.display = "block";
      input.parentElement.parentElement.style.borderColor = "var(--accent-primary)";
    } else {
      allCorrect = false;
      feedback.innerHTML = "✗ MISMATCH DETECTED";
      feedback.style.color = "var(--accent-neon)";
      feedback.style.display = "block";
      input.parentElement.parentElement.style.borderColor = "var(--accent-neon)";
      playSound(200, 'sawtooth', 0.1);
    }
  });

  if (allCorrect) {
    playSound(900, 'sine', 0.5);
    showModal('Node Decrypted', `
      <p style="margin-bottom: 25px; color: var(--text-secondary);">The memory block has been successfully synchronized. Access to the next neural node is now authorized.</p>
      <button class="btn-primary" style="width: 100%;" onclick="this.parentElement.parentElement.remove(); window.completeTask(${id})">Proceed to Nexus</button>
    `);
  }
};

window.renderHome = () => render('home');

window.completeTask = (id) => {
  playSound(880, 'sine', 0.3);
  const task = state.tasks.find(t => t.id === id);
  task.completed = true;

  // Unlock next task
  const nextTask = state.tasks.find(t => t.id === id + 1);
  if (nextTask) {
    nextTask.unlocked = true;
  }

  // Update user progress
  const user = state.users.find(u => u.name === state.user.name);
  if (user) {
    user.tasksCompleted = state.tasks.filter(t => t.completed).length;
    user.progress = Math.round((user.tasksCompleted / state.tasks.length) * 100) + '%';
    user.lastActive = new Date().toISOString();
  }

  saveState();

  // Check if all tasks are complete
  const allComplete = state.tasks.every(t => t.completed);
  if (allComplete) {
    setTimeout(() => render('success'), 1000);
  } else {
    render('home');
  }
};

const renderSuccess = () => {
  app.innerHTML = `
    <div class="view-container">
      <div class="welcome-screen">
        <div class="success-icon" style="font-size: 5rem; margin-bottom: 20px; animation: pulse-glow 2s infinite;">🏆</div>
        <h1 class="welcome-msg gradient-text" style="font-weight: 800; letter-spacing: -1px;">Thank You for Participating!</h1>
        <p style="margin-top: 20px; color: var(--accent-primary); font-family: var(--font-mono); font-size: 1.1rem; letter-spacing: 2px;">NEURAL EVOLUTION COMPLETE</p>
        <p style="margin-top: 40px; color: var(--text-secondary); max-width: 600px; margin-inline: auto;">You have successfully navigated the "Bug to Brain" challenges and achieved full synchronization.</p>
        <button class="btn-primary" style="margin-top: 50px;" onclick="location.reload()">Return to Entry</button>
      </div>
    </div>
  `;
  playSound(1000, 'sine', 0.8);
};

const showModal = (title, contentHTML, extraClass = '') => {
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.innerHTML = `
    <div class="modal-content glass ${extraClass}">
      <button class="modal-close" onclick="this.parentElement.parentElement.remove()">×</button>
      <h2 class="modal-title">${title}</h2>
      ${contentHTML}
    </div>
  `;
  document.body.appendChild(overlay);
  return overlay;
};


const promptTaskModify = (taskId) => {
  const modal = showModal('Modify Node', `
    <div class="input-group">
      <label class="input-label">Challenge Content (Code/Text)</label>
      <textarea id="new-q" class="form-textarea" placeholder="Enter logic or code snippet..."></textarea>
    </div>
    <div class="input-group">
      <label class="input-label">Expected Solution</label>
      <input type="text" id="new-a" class="form-input" placeholder="Enter target answer...">
    </div>
    <button id="save-node" class="btn-primary" style="width: 100%;">Commit to Registry</button>
  `, 'modal-large');

  document.getElementById('save-node').onclick = () => {
    const q = document.getElementById('new-q').value;
    const a = document.getElementById('new-a').value;
    if (q && a) {
      const task = state.tasks.find(t => t.id === taskId);
      task.questions.push({ q, a });
      saveState();
      modal.remove();
      if (state.currentView === 'task') render('task', { taskId });
      if (state.currentView === 'admin') render('admin');
      playSound(880, 'sine');
    }
  };
};

const renderAdmin = () => {
  app.innerHTML = `
    <div class="view-container">
      <div class="admin-container glass">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px;">
          <h1 class="gradient-text">ADMIN DASHBOARD</h1>
          <button class="btn-secondary" onclick="location.reload()">Logout</button>
        </div>
        
        <div class="admin-stats" style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-bottom: 40px;">
          <div class="glass" style="padding: 20px; text-align: center;">
            <div style="font-size: 0.8rem; color: var(--text-secondary);">TOTAL USERS</div>
            <div style="font-size: 2rem; font-weight: 800; color: var(--accent-primary);">${state.users.length}</div>
          </div>
          <div class="glass" style="padding: 20px; text-align: center;">
            <div style="font-size: 0.8rem; color: var(--text-secondary);">TASKS ACTIVE</div>
            <div style="font-size: 2rem; font-weight: 800; color: var(--accent-secondary);">${state.tasks.length}</div>
          </div>
          <div class="glass" style="padding: 20px; text-align: center;">
            <div style="font-size: 0.8rem; color: var(--text-secondary);">AVG PROGRESS</div>
            <div style="font-size: 2rem; font-weight: 800; color: var(--accent-neon);">
              ${state.users.length ? Math.round(state.users.reduce((acc, u) => acc + parseInt(u.progress), 0) / state.users.length) : 0}%
            </div>
          </div>
        </div>

        <table class="admin-table">
          <thead>
            <tr>
              <th>Username</th>
              <th>Tasks Completed</th>
              <th>Progress</th>
              <th>Last Active</th>
            </tr>
          </thead>
          <tbody>
            ${state.users.map(u => `
              <tr>
                <td>${u.name}</td>
                <td>${u.tasksCompleted} / ${state.tasks.length}</td>
                <td>
                  <div style="width: 100%; height: 6px; background: rgba(255,255,255,0.1); border-radius: 3px; position: relative;">
                    <div style="width: ${u.progress}; height: 100%; background: var(--accent-primary); border-radius: 3px;"></div>
                  </div>
                  <span style="font-size: 0.7rem;">${u.progress}</span>
                </td>
                <td style="font-size: 0.8rem; color: var(--text-secondary);">${new Date(u.lastActive).toLocaleString()}</td>
              </tr>
            `).join('')}
            ${state.users.length === 0 ? '<tr><td colspan="4" style="text-align: center; padding: 40px;">No user data available yet.</td></tr>' : ''}
          </tbody>
        </table>

        <h2 class="gradient-text" style="margin: 40px 0 20px 0; font-size: 1.5rem;">TASK CONFIGURATION</h2>
        <table class="admin-table">
          <thead>
            <tr>
              <th>Task Node</th>
              <th>Status</th>
              <th>Questions</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            ${state.tasks.map(t => `
              <tr>
                <td>${t.title}</td>
                <td><span style="color: ${t.unlocked ? 'var(--accent-primary)' : 'var(--accent-neon)'}">${t.unlocked ? 'ACTIVE' : 'LOCKED'}</span></td>
                <td>${t.questions.length} Nodes</td>
                <td>
                  <button class="btn-secondary" style="padding: 5px 15px; font-size: 0.7rem; color: var(--accent-primary);" onclick="window.editTaskInfo(${t.id})">Edit Info</button>
                  <button class="btn-secondary" style="padding: 5px 15px; font-size: 0.7rem;" onclick="window.promptTaskModify(${t.id})">+ Add Question</button>
                  <button class="btn-secondary" style="padding: 5px 15px; font-size: 0.7rem; color: var(--accent-neon);" onclick="window.clearTaskQuestions(${t.id})">Reset</button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <div style="margin-top: 40px; display: flex; gap: 20px;">
           <button class="btn-primary" onclick="window.exportToJSON()">Export User Data (JSON)</button>
           <button class="btn-secondary" onclick="window.clearData()">Reset System</button>
        </div>
      </div>
    </div>
  `;
};

window.promptTaskModify = promptTaskModify;

window.clearTaskQuestions = (taskId) => {
  showModal('Purge Challenge Data', `
    <p style="margin-bottom: 25px; color: var(--accent-neon);">Are you sure you want to delete all challenges for this node? This action will permanently remove all associated code snippets and solutions.</p>
    <div style="display: flex; gap: 15px;">
      <button class="btn-primary" style="flex: 1; background: var(--accent-neon);" onclick="window.executeTaskClear(${taskId})">Confirm Purge</button>
      <button class="btn-secondary" style="flex: 1;" onclick="this.parentElement.parentElement.parentElement.remove()">Abort</button>
    </div>
  `);
};

window.executeTaskClear = (taskId) => {
  const task = state.tasks.find(t => t.id === taskId);
  task.questions = [];
  saveState();
  const modal = document.querySelector('.modal-overlay');
  if (modal) modal.remove();
  render('admin');
  playSound(200, 'sawtooth', 0.2);
};

window.editTaskInfo = (taskId) => {
  const task = state.tasks.find(t => t.id === taskId);
  const modal = showModal('Edit Task Node', `
    <div class="input-group">
      <label class="input-label">Task Title</label>
      <input type="text" id="edit-task-title" class="form-input" value="${task.title}">
    </div>
    <div class="input-group">
      <label class="input-label">Task Description</label>
      <textarea id="edit-task-desc" class="form-textarea" style="min-height: 100px;">${task.description}</textarea>
    </div>
    <button id="save-task-info" class="btn-primary" style="width: 100%;">Save Node Info</button>
  `, 'modal-large');

  document.getElementById('save-task-info').onclick = () => {
    const newTitle = document.getElementById('edit-task-title').value;
    const newDesc = document.getElementById('edit-task-desc').value;
    if (newTitle && newDesc) {
      task.title = newTitle;
      task.description = newDesc;
      saveState();
      modal.remove();
      render('admin');
      playSound(880, 'sine');
    }
  };
};

window.exportToJSON = () => {
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({ users: state.users, tasks: state.tasks }, null, 2));
  const downloadAnchorNode = document.createElement('a');
  downloadAnchorNode.setAttribute("href", dataStr);
  downloadAnchorNode.setAttribute("download", "bug_to_brain_data.json");
  document.body.appendChild(downloadAnchorNode);
  downloadAnchorNode.click();
  downloadAnchorNode.remove();
};

window.clearData = () => {
  showModal('System Reset', `
    <p style="margin-bottom: 25px; color: var(--accent-neon);">WARNING: This action will permanently purge all user data, task progress, and custom nodes from the local database. This cannot be undone.</p>
    <div style="display: flex; gap: 15px;">
      <button class="btn-primary" style="flex: 1; background: var(--accent-neon);" onclick="localStorage.removeItem('btb_tasks'); localStorage.removeItem('btb_users'); location.reload();">Purge All Data</button>
      <button class="btn-secondary" style="flex: 1;" onclick="this.parentElement.parentElement.parentElement.remove()">Abort</button>
    </div>
  `);
};

// Initial Render
render('login');
