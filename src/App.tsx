import { useMemo, useState } from 'react';
import { AppShell } from './components/Shell';
import { Stepper } from './components/Stepper';
import {
  StepName,
  StepProgramme,
  StepUTME,
  StepOLevel,
  StepPostUtme,
  type OlevelRow,
} from './components/Steps';
import { Results } from './components/Results';
import { Alternatives } from './components/Alternatives';
import { gradeToPoints, type OlevelEntry, type StudentInput } from './lib/scoring';

const EMPTY_OLEVEL: OlevelRow[] = Array.from({ length: 7 }, () => ({
  subject: '',
  grade: '',
}));

export default function App() {
  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [programmeName, setProgrammeName] = useState('');
  const [utmeScore, setUtmeScore] = useState('');
  // UTME always includes English, so it's pre-selected in the first slot.
  const [utmeSubjects, setUtmeSubjects] = useState<string[]>([
    'English Language',
    '',
    '',
    '',
  ]);
  const [olevel, setOlevel] = useState<OlevelRow[]>(EMPTY_OLEVEL);
  const [stateOfOrigin, setStateOfOrigin] = useState('');
  const [postUtme, setPostUtme] = useState('');
  const [exploring, setExploring] = useState(false);

  const studentResults: OlevelEntry[] = useMemo(
    () =>
      olevel
        .filter((r) => r.subject && r.grade)
        .map((r) => ({
          subject: r.subject,
          grade: r.grade,
          points: gradeToPoints(r.grade),
        })),
    [olevel],
  );

  const input: StudentInput = useMemo(
    () => ({ utmeScore, utmeSubjects, stateOfOrigin, postUtme, programmeName }),
    [utmeScore, utmeSubjects, stateOfOrigin, postUtme, programmeName],
  );

  const go = (n: number) => {
    setStep(n);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const restart = () => {
    setName('');
    setProgrammeName('');
    setUtmeScore('');
    setUtmeSubjects(['English Language', '', '', '']);
    setOlevel(EMPTY_OLEVEL);
    setStateOfOrigin('');
    setPostUtme('');
    setExploring(false);
    go(0);
  };

  const explore = (on: boolean) => {
    setExploring(on);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <AppShell>
      {step < 5 && <Stepper step={step} />}

      {step === 0 && (
        <StepName value={name} onChange={setName} onNext={() => go(1)} />
      )}
      {step === 1 && (
        <StepProgramme
          value={programmeName}
          onChange={setProgrammeName}
          name={name}
          onNext={() => go(2)}
          onBack={() => go(0)}
        />
      )}
      {step === 2 && (
        <StepUTME
          score={utmeScore}
          onScore={setUtmeScore}
          subjects={utmeSubjects}
          onSubjects={setUtmeSubjects}
          onNext={() => go(3)}
          onBack={() => go(1)}
        />
      )}
      {step === 3 && (
        <StepOLevel
          rows={olevel}
          onRows={setOlevel}
          stateOfOrigin={stateOfOrigin}
          onState={setStateOfOrigin}
          onNext={() => go(4)}
          onBack={() => go(2)}
        />
      )}
      {step === 4 && (
        <StepPostUtme
          score={postUtme}
          onScore={setPostUtme}
          onNext={() => go(5)}
          onBack={() => go(3)}
        />
      )}
      {step === 5 &&
        (exploring ? (
          <Alternatives
            name={name}
            input={input}
            studentResults={studentResults}
            onBack={() => explore(false)}
          />
        ) : (
          <Results
            name={name}
            input={input}
            studentResults={studentResults}
            onEdit={() => go(4)}
            onRestart={restart}
            onExplore={() => explore(true)}
          />
        ))}
    </AppShell>
  );
}
