import './styles/styles.css';
import Onboarding from './modules/onboarding';
import Layout from './modules/layout';
import TodoManager from './modules/todos';
import ProjectManager from './modules/projects';

const onboarding = new Onboarding();
onboarding.init().then(userData => {
    console.log('User setup complete:', userData);
    
    const todoManager = new TodoManager();
    const projectManager = new ProjectManager(todoManager);
    
    const layout = new Layout(userData, todoManager, projectManager);
    layout.init();
});
