
interface TeleprompterCountdownProps {
  countdown: number;
  isVisible: boolean;
}

export function TeleprompterCountdown({ countdown, isVisible }: TeleprompterCountdownProps) {
  if (!isVisible) return null;

  return (
    <div className="absolute inset-0 bg-black bg-opacity-90 flex items-center justify-center z-10">
      <div className="text-white text-center">
        <div className="text-9xl font-bold mb-6 text-green-400">{countdown}</div>
        <div className="text-2xl text-gray-300">Get ready to read...</div>
      </div>
    </div>
  );
}
