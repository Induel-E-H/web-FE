export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    // 타입은 아이콘 + 공백 + 값 형식이어야 함
    'type-enum': [
      2,
      'always',
      [
        '✨ feat',
        '👹 fix',
        '🔨 refactor',
        '⚡️ perf',
        '📝 docs',
        '✅ test',
        '⚙️ chore',
        '🧹 clean',
      ],
    ],
    // 타입은 소문자 강제하지 않음 (아이콘 때문)
    'type-case': [0],
    // 제목은 최대 100자
    'subject-max-length': [2, 'always', 100],
    // 제목은 빈 문자열이면 안됨
    'subject-empty': [2, 'never'],
    // 제목 끝에 마침표 금지
    'subject-full-stop': [2, 'never', '.'],
    // 본문은 선택사항
    'body-leading-blank': [0],
    // scope는 사용하지 않음
    'scope-empty': [0],
  },
  // 커스텀 파서 설정
  parserPreset: {
    parserOpts: {
      // 이모지가 포함된 타입을 올바르게 파싱하기 위한 정규식
      headerPattern: /^(.+?):\s(.+)$/,
      headerCorrespondence: ['type', 'subject'],
    },
  },
};
