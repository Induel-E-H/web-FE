module.exports = {
  types: [
    {
      value: "✨ feat",
      name: "✨ feat: 기능 추가 시 사용",
    },
    {
      value: "👹 fix",
      name: "👹 fix: 버그 수정 시 사용",
    },
    {
      value: "🔨 refactor",
      name: "🔨 refactor: 구조 변경, 코드 아키텍처 변경 시 사용",
    },
    {
      value: "⚡️ perf",
      name: "⚡️ perf: 성능 개선 및 코드 개선 시 사용",
    },
    {
      value: "📝 docs",
      name: "📝 docs: 문서 수정 시 사용",
    },
    {
      value: "✅ test",
      name: "✅ test: 테스트 코드 수정, 추가 시 사용",
    },
    {
      value: "⚙️ chore",
      name: "⚙️ chore: 개발 환경 구축, 설정 시 사용",
    },
    {
      value: "🧹 clean",
      name: "🧹 clean: 사소한 코드 수정, 코드 정리",
    },
  ],
  messages: {
    type: "커밋 메시지 타입을 선택해주세요: ",
    subject: "커밋 메시지 내용을 입력해주세요: ",
    confirmCommit: "커밋 내용이 확실한가요?",
  },
  allowCustomScopes: false,
  skipQuestions: ["body", "scope", "footer"],
  skipEmptyScopes: false,
  subjectLimit: 100,
};
