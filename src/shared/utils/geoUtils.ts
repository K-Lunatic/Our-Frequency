export async function getLongitudeByIP(): Promise<number> {
  try {
    const response = await fetch('https://ipapi.co/json/');
    if (!response.ok) throw new Error('Network response was not ok');
    
    const data = await response.json();
    
    return data.longitude ? data.longitude : 127.0;
  } catch (error) {
    console.warn("IP 위치 획득 실패. 기본값(서울 경도 127도)으로 대체합니다.", error);
    return 127.0;
  }
}