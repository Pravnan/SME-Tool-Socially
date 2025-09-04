'use client';

type LoginButtonProps = {
  text?: string;
  onClick?: () => void;
};

export default function LoginButton({ text = 'Login', onClick }: LoginButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none 
                focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
    >
      {text}
    </button>
  );
}
