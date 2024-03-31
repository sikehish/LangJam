import React from 'react';
import useWindowSize from 'react-use/lib/useWindowSize';
import Confetti from 'react-confetti';

interface ConfettiComponentProps {
  setIsConfettiVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

const ConfettiComponent: React.FC<ConfettiComponentProps> = ({ setIsConfettiVisible }) => {
  const { width, height } = useWindowSize();

  return (
    <Confetti
      onConfettiComplete={() => {
        setIsConfettiVisible(false);
      }}
      recycle={false}
      width={width}
      height={height}
    />
  );
};

export default ConfettiComponent;
