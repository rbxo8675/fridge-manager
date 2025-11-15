// MockAPI.io에 냉장고 데이터 추가 스크립트
const API_URL = "https://6915287784e8bd126af8d6f6.mockapi.io/user";

const fridgeData = [
  {name: "우유", qty: 2, type: "냉장", status: "좋음", buy: "2025-11-10", expire: "2025-11-20", price: 3000, note: "서울우유"},
  {name: "계란", qty: 10, type: "냉장", status: "좋음", buy: "2025-11-08", expire: "2025-11-22", price: 5000, note: "특란"},
  {name: "김치", qty: 1, type: "냉장", status: "빨리 먹어야 함", buy: "2025-10-25", expire: "2025-11-18", price: 8000, note: "엄마가 담근 김치"},
  {name: "아이스크림", qty: 3, type: "냉동", status: "좋음", buy: "2025-11-12", expire: "2026-05-12", price: 4500, note: "바닐라"},
  {name: "치킨", qty: 1, type: "냉장", status: "빨리 먹어야 함", buy: "2025-11-13", expire: "2025-11-15", price: 20000, note: "후라이드"},
  {name: "딸기", qty: 1, type: "냉장", status: "폐기 예정", buy: "2025-11-05", expire: "2025-11-14", price: 12000, note: "설향"},
  {name: "만두", qty: 2, type: "냉동", status: "좋음", buy: "2025-11-01", expire: "2026-02-01", price: 6000, note: "왕교자"},
  {name: "요구르트", qty: 5, type: "냉장", status: "좋음", buy: "2025-11-11", expire: "2025-11-25", price: 3500, note: "불가리스"},
  {name: "삼겹살", qty: 1, type: "냉장", status: "빨리 먹어야 함", buy: "2025-11-12", expire: "2025-11-16", price: 15000, note: "국내산"},
  {name: "냉동피자", qty: 2, type: "냉동", status: "좋음", buy: "2025-11-10", expire: "2026-01-10", price: 8000, note: "콤비네이션"},
  {name: "치즈", qty: 1, type: "냉장", status: "좋음", buy: "2025-11-09", expire: "2025-12-09", price: 7000, note: "체다 치즈"},
  {name: "사과", qty: 5, type: "냉장", status: "좋음", buy: "2025-11-13", expire: "2025-11-27", price: 10000, note: "부사"},
  {name: "베이컨", qty: 1, type: "냉장", status: "빨리 먹어야 함", buy: "2025-11-10", expire: "2025-11-17", price: 6500, note: ""},
  {name: "아이스", qty: 4, type: "냉동", status: "좋음", buy: "2025-11-11", expire: "2026-03-11", price: 5000, note: "월드콘"}
];

async function addData() {
  console.log('MockAPI.io에 데이터 추가 중...\n');
  
  for (let i = 0; i < fridgeData.length; i++) {
    const item = fridgeData[i];
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item)
      });
      
      if (response.ok) {
        const result = await response.json();
        console.log(`✅ ${i + 1}. ${item.name} 추가됨 (ID: ${result.id})`);
      } else {
        console.log(`❌ ${i + 1}. ${item.name} 추가 실패 (${response.status})`);
      }
    } catch (error) {
      console.log(`❌ ${i + 1}. ${item.name} 추가 실패:`, error.message);
    }
    
    // API 호출 간격 (Rate limit 방지)
    await new Promise(resolve => setTimeout(resolve, 300));
  }
  
  console.log('\n✨ 완료! 총 ' + fridgeData.length + '개 항목 추가됨');
}

addData();
