import { useNavigate } from 'react-router-dom';

interface Props {
  hasCode: boolean;
}

export default function HomeActionNav({ hasCode }: Props) {
  const navigate = useNavigate();

  return (
    <nav className="flex flex-col gap-2 w-full">
      {hasCode ? (
        <>
          <button onClick={() => navigate('/result')} className="btn-primary">
            내 마음 확인하기
          </button>
          {/* 💡 기존 디자인의 넉넉한 간격(mt-2)과 그리드 갭 복구 */}
          <div className="grid grid-cols-2 gap-2 mt-2">
            <button onClick={() => navigate('/test')} className="btn-secondary">
              다시 테스트
            </button>
            <button onClick={() => navigate('/realsaju')} className="btn-secondary">
              생년월일로 보기
            </button>
          </div>
        </>
      ) : (
        <>
          <button onClick={() => navigate('/test')} className="btn-primary">
            성향 테스트 시작하기
          </button>
          <button 
            onClick={() => navigate('/realsaju')} 
            className="w-full py-2 mt-2 text-xs font-medium text-stone-400 underline underline-offset-4 hover:text-stone-800 transition-colors"
          >
            정확한 생년월일시로 확인하기
          </button>
        </>
      )}
    </nav>
  );
}