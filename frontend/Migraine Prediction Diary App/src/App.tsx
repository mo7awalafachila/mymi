import { useState } from 'react';
import SignupScreen1 from './imports/SignupScreen1';
import SignupScreen2 from './imports/SignupScreen2';
import SignupScreen3 from './imports/SignupScreen3';
import SignupScreen4 from './imports/SignupScreen4';
import ButtonScreen from './imports/ButtonScreen';
import MainPage from './imports/MainPage';
import Forum from './imports/Forum';
import ChecklistQuestion from './imports/ChecklistQuestion';
import ChecklistQuestion2 from './imports/ChecklistQuestion2';
import ChecklistQuestion3 from './imports/ChecklistQuestion3';
import ChecklistQuestion4 from './imports/ChecklistQuestion4';
import MigraineRiskPage from './imports/MigraineRiskPage';
import MigraineRiskPage2 from './imports/MigraineRiskPage2';
import MigraineRiskPage3 from './imports/MigraineRiskPage3';
import MigraineRiskPage4 from './imports/MigraineRiskPage4';
import SuccessPage from './imports/SuccessPage';

type MainView = 'home' | 'forum' | 'checklist' | 'checklist2' | 'checklist3' | 'checklist4' | 'risk' | 'risk2' | 'risk3' | 'risk4' | 'success';

export default function App() {
  const [currentStep, setCurrentStep] = useState(1);
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [mainView, setMainView] = useState<MainView>('home');

  const handleContinue = () => {
    if (currentStep < 6) {
      setCurrentStep(currentStep + 1);
    }
  };

  return (
    <div className="w-full h-screen">
      {currentStep === 1 && <SignupScreen1 onContinue={handleContinue} />}
      {currentStep === 2 && (
        <SignupScreen2 
          onContinue={handleContinue} 
          name={name}
          setName={setName}
        />
      )}
      {currentStep === 3 && (
        <SignupScreen3 
          onContinue={handleContinue}
          age={age}
          setAge={setAge}
        />
      )}
      {currentStep === 4 && (
        <SignupScreen4 
          onContinue={handleContinue}
          gender={gender}
          setGender={setGender}
        />
      )}
      {currentStep === 5 && (
        <ButtonScreen onContinue={handleContinue} />
      )}
      {currentStep === 6 && mainView === 'home' && (
        <MainPage 
          onNavigateToForum={() => setMainView('forum')}
          onNavigateToChecklist={() => setMainView('checklist')}
        />
      )}
      {currentStep === 6 && mainView === 'forum' && (
        <Forum 
          onNavigateToHome={() => setMainView('home')}
          onNavigateToChecklist={() => setMainView('checklist')}
        />
      )}
      {currentStep === 6 && mainView === 'checklist' && (
        <ChecklistQuestion
          onNavigateToHome={() => setMainView('home')}
          onNo={() => setMainView('risk')}
          onYes={() => setMainView('checklist2')}
        />
      )}
      {currentStep === 6 && mainView === 'checklist2' && (
        <ChecklistQuestion2
          onNavigateToHome={() => setMainView('home')}
          onNo={() => setMainView('risk2')}
          onYes={() => setMainView('checklist3')}
        />
      )}
      {currentStep === 6 && mainView === 'checklist3' && (
        <ChecklistQuestion3
          onNavigateToHome={() => setMainView('home')}
          onNo={() => setMainView('checklist4')}
          onYes={() => setMainView('risk3')}
        />
      )}
      {currentStep === 6 && mainView === 'checklist4' && (
        <ChecklistQuestion4
          onNavigateToHome={() => setMainView('home')}
          onNo={() => setMainView('risk4')}
          onYes={() => setMainView('success')}
        />
      )}
      {currentStep === 6 && mainView === 'risk' && (
        <MigraineRiskPage onBack={() => setMainView('home')} />
      )}
      {currentStep === 6 && mainView === 'risk2' && (
        <MigraineRiskPage2 onBack={() => setMainView('home')} />
      )}
      {currentStep === 6 && mainView === 'risk3' && (
        <MigraineRiskPage3 onBack={() => setMainView('home')} />
      )}
      {currentStep === 6 && mainView === 'risk4' && (
        <MigraineRiskPage4 onBack={() => setMainView('home')} />
      )}
      {currentStep === 6 && mainView === 'success' && (
        <SuccessPage
          onNavigateToHome={() => setMainView('home')}
          onNavigateToForum={() => setMainView('forum')}
          onNavigateToChecklist={() => setMainView('checklist')}
        />
      )}
    </div>
  );
}
