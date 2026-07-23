import { useMemo, useState } from 'react';
import { AppShell } from './components/Shell';
import { Stepper } from './components/Stepper';
import {
  StepName,
  StepProgramme,
  StepUTME,
  StepOLevel,
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
  const [utmeSubjects, setUtmeSubjects] = useState<string[]>(['', '', '', '']);
  const [olevel, setOlevel] = useState<OlevelRow[]>(EMPTY_OLEVEL);
  const [stateOfOrigin, setStateOfOrigin] = useState('');
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
    () => ({ utmeScore, utmeSubjects, stateOfOrigin, programmeName }),
    [utmeScore, utmeSubjects, stateOfOrigin, programmeName],
  );

  const go = (n: number) => {
    setStep(n);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const restart = () => {
    setName('');
    setProgrammeName('');
    setUtmeScore('');
    setUtmeSubjects(['', '', '', '']);
    setOlevel(EMPTY_OLEVEL);
    setStateOfOrigin('');
    setExploring(false);
    go(0);
  };

  const explore = (on: boolean) => {
    setExploring(on);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <AppShell>
      {step < 4 && <Stepper step={step} />}

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
      {step === 4 &&
        (exploring ? (
          <Alternatives
            input={input}
            studentResults={studentResults}
            onBack={() => explore(false)}
          />
        ) : (
          <Results
            name={name}
            input={input}
            studentResults={studentResults}
            onEdit={() => go(3)}
            onRestart={restart}
            onExplore={() => explore(true)}
          />
        ))}
    </AppShell>
  );
}
