export interface ApiResponse<T> {
  status: {
    code: string;
    message?: string;
  };
  info: T;
}

export interface LoginRequest {
  userId: string;
  userPwd: string;
}

export interface LoginResponse {
  insEmpNo?: string;
  insDate?: string;
  updEmpNo?: string;
  updDate?: string;
  procEmpNo?: string;
  procDate?: string;
  userId?: string;        // POS 사용자 ID
  userNm?: string;        // POS 사용자 명
  facilityCd?: string;    // 사업장 코드
  posVersion?: string;    // 포스 버전
  lastLoginDate?: string; // 마지막 로그인 일시
  startDt?: string;       // 시작 일시
  endDt?: string;         // 종료 일시
  facilityNm?: string;    // 사업장 명
  posNo?: string;         // POS 번호
  posNm?: string;         // POS 명
  posGb?: string;         // POS 구분
  posKind?: string;       // POS 종류
  uuid?: string;          // UUID
  location?: string;      // 사업장 위치
  posIp?: string;         // POS IP
  autoCheckYn?: string;   // 자동 검표 여부
  capTerminalNo?: string; // 캣단말기 번호
  wechatTerminalNo?: string; // 위쳇 단말기 번호
  aliTerminalNo?: string;    // 알리 페이 단말기 번호
  lastSaleDt?: string;    // 마지막 판매 일시
  useYn?: string;         // 사용 여부
  saleDt?: string;        // 판매 일시
  subSeq?: string;
  rdyAmt: number;         // POS 시재금
  key?: string;           // KEY
  tokenValue?: string;    // token 값
  loginType?: string;     // LOGIN 타입
  loginDeviceId?: string; // LOGIN 장비 ID
  addr1?: string;
  addr2?: string;
  ownerNm?: string;
  saupjaNo?: string;
  telNo?: string;
  telNumber?: string;
  saleViewType?: string;  // 판매상태 타입
}
