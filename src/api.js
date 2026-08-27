/**
 * FraudShield — API Layer & C++ Backend Mock Contract
 * 
 * Keep these exact paths/shapes in api.js with mock data behind them,
 * so wiring in the real C++ endpoints later is a one-file change.
 */

// Initial Seed Data for Demo & Evaluation
const SEED_COMPLAINTS = [
  {
    complaintId: "CMP-102",
    filedBy: "siddharth_kumar",
    targetIdentifier: "rajesh.mule@oksbi",
    targetType: "upi",
    riskScore: 94,
    flagged: true,
    status: "INVESTIGATING",
    filedAt: "2026-08-27 14:22:10",
    holderName: "Rajesh Kumar",
    holderMasked: "R****h K***r",
    details: "Victim reported coerced urgent funds diversion following fake telecom KYC renewal notice.",
    linkedAccounts: [
      { accountNumber: "ACC-10096", holderName: "Rajesh Kumar (Mule Central)", riskScore: 94, status: "FLAGGED" },
      { accountNumber: "ACC-88219", holderName: "Layer-2 Crypto Gateway A", riskScore: 88, status: "FLAGGED" },
      { accountNumber: "ACC-55102", holderName: "Layer-2 Bullion Cashout B", riskScore: 91, status: "FLAGGED" },
      { accountNumber: "ACC-40019", holderName: "Verified P2P Merchant Node", riskScore: 12, status: "VERIFIED" }
    ],
    transactionTrail: [
      { id: "TXN-88F101", from: "ACC-7A1B8C9D (Siddharth)", to: "ACC-10096 (Rajesh Mule)", amount: "₹45,000", date: "2026-08-27 14:18", status: "HELD_IN_ESCROW" },
      { id: "TXN-88F102", from: "ACC-10096 (Rajesh Mule)", to: "ACC-88219 (Crypto P2P)", amount: "₹22,000", date: "2026-08-27 14:21", status: "INTERCEPTED" },
      { id: "TXN-88F103", from: "ACC-10096 (Rajesh Mule)", to: "ACC-55102 (Bullion Node)", amount: "₹23,000", date: "2026-08-27 14:21", status: "INTERCEPTED" }
    ]
  },
  {
    complaintId: "CMP-101",
    filedBy: "anita_sharma",
    targetIdentifier: "invest_guru@ybl",
    targetType: "upi",
    riskScore: 89,
    flagged: true,
    status: "FROZEN",
    filedAt: "2026-08-27 11:05:42",
    holderName: "Deepak Sharma (Invest Guru)",
    holderMasked: "I****t G**u",
    details: "High-yield daily Telegram task investment fraud payout redirection.",
    linkedAccounts: [
      { accountNumber: "ACC-99014", holderName: "Invest Guru Global Hub", riskScore: 89, status: "FROZEN" },
      { accountNumber: "ACC-33100", holderName: "Pass-thru Student Account", riskScore: 82, status: "FLAGGED" }
    ],
    transactionTrail: [
      { id: "TXN-77A001", from: "ACC-VIC-A01 (Anita)", to: "ACC-99014 (Invest Guru)", amount: "₹1,50,000", date: "2026-08-27 11:02", status: "HELD_IN_ESCROW" }
    ]
  },
  {
    complaintId: "CMP-100",
    filedBy: "ramesh_verma",
    targetIdentifier: "ACC-44910283",
    targetType: "account",
    riskScore: 76,
    flagged: true,
    status: "RESOLVED",
    filedAt: "2026-08-26 18:40:15",
    holderName: "Vivek Singh",
    holderMasked: "V***k S***h",
    details: "Compromised credential login after phishing SMS with fake electricity bill disconnect threat.",
    linkedAccounts: [
      { accountNumber: "ACC-44910283", holderName: "Vivek Singh Conduit", riskScore: 76, status: "FLAGGED" }
    ],
    transactionTrail: [
      { id: "TXN-66B990", from: "ACC-VIC-B01 (Ramesh)", to: "ACC-44910283 (Vivek)", amount: "₹28,500", date: "2026-08-26 18:35", status: "RECOVERED" }
    ]
  }
];

class ApiService {
  constructor() {
    this.complaints = [...SEED_COMPLAINTS];
    this.frozenAccounts = new Set(["ACC-99014"]);
  }

  // Helper delay to mimic real network latency (~200ms)
  async delay(ms = 220) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  // 1. POST /api/auth/customer/login (Password based)
  async customerLogin({ username, password }) {
    await this.delay(200);
    if (!username || !username.trim()) {
      throw new Error("Username or Account Number is required");
    }
    if (!password || !password.trim()) {
      throw new Error("Password is required");
    }
    const token = `cust_token_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    const user = {
      role: "customer",
      username: username.trim(),
      token
    };
    localStorage.setItem("fraudshield_auth", JSON.stringify(user));
    return user;
  }

  // 2. POST /api/auth/customer/register (Create Account)
  async customerRegister({ accountHolderName, accountNumber, password }) {
    await this.delay(300);
    if (!accountHolderName || !accountHolderName.trim()) {
      throw new Error("Account Holder Name is required");
    }
    if (!accountNumber || !accountNumber.trim()) {
      throw new Error("Account Number is required");
    }
    if (!password || password.length < 4) {
      throw new Error("Password must be at least 4 characters long");
    }
    const token = `cust_token_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    const user = {
      role: "customer",
      username: accountHolderName.trim().toLowerCase().replace(/\s+/g, '_'),
      accountHolderName: accountHolderName.trim(),
      accountNumber: accountNumber.trim(),
      token
    };
    localStorage.setItem("fraudshield_auth", JSON.stringify(user));
    return user;
  }

  // Legacy OTP helpers kept for compatibility
  async requestCustomerOtp({ username }) {
    await this.delay(180);
    return { success: true, message: `OTP sent for ${username}`, demoOtp: "1234" };
  }
  async verifyCustomerOtp({ username, otp }) {
    return this.customerLogin({ username, password: "password" });
  }

  // 3. POST /api/auth/officer/login
  async officerLogin({ officerId, password }) {
    await this.delay(220);
    if (!officerId || !password) {
      throw new Error("Officer ID and password are required");
    }
    const token = `off_token_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    const user = {
      role: "officer",
      officerId: officerId.trim(),
      token
    };
    localStorage.setItem("fraudshield_auth", JSON.stringify(user));
    return user;
  }

  // 3b. POST /api/auth/officer/register (Create Officer Account)
  async officerRegister({ employeeId, password }) {
    await this.delay(300);
    if (!employeeId || !employeeId.trim()) {
      throw new Error("Employee ID is required");
    }
    if (!password || password.length < 4) {
      throw new Error("Password must be at least 4 characters long");
    }
    const token = `off_token_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    const user = {
      role: "officer",
      officerId: employeeId.trim().toUpperCase(),
      token
    };
    localStorage.setItem("fraudshield_auth", JSON.stringify(user));
    return user;
  }

  // 4. POST /api/fraud/check
  async checkFraud({ identifierType, identifier, fileComplaint }) {
    await this.delay(350);
    const cleaned = (identifier || "").trim().toLowerCase();

    let riskScore = 14;
    let flagged = false;
    let holderMasked = "S***a K***r";
    let holderName = "Suresh Kumar";
    let riskReasons = [];

    if (cleaned.includes("rajesh") || cleaned.includes("mule") || cleaned.includes("7829")) {
      riskScore = 94;
      flagged = true;
      holderName = "Rajesh Kumar";
      holderMasked = "R****h K***r";
      riskReasons = [
        { 
          label: "Money is Transferred Out Immediately (Mule Pattern)", 
          detail: "Whenever money enters this account, it is instantly split and forwarded to other unknown accounts within seconds to hide where it went." 
        },
        { 
          label: "Brand New Account with Huge Sudden Payments", 
          detail: "This bank account was created just 12 days ago and has suddenly received an unusual rush of over ₹2,50,000." 
        },
        { 
          label: "Already Reported by Other Victims", 
          detail: "3 other people have already reported losing money or filed fraud complaints against this account." 
        }
      ];
    } else if (cleaned.includes("guru") || cleaned.includes("crypto") || cleaned.includes("invest") || cleaned.includes("99014")) {
      riskScore = 88;
      flagged = true;
      holderName = "Deepak Sharma (Invest Guru)";
      holderMasked = "I****t G**u";
      riskReasons = [
        { 
          label: "Matches Fake Investment & Task Scams", 
          detail: "This account matches patterns commonly used in fake work-from-home tasks and 'double your money' Telegram schemes." 
        },
        { 
          label: "Almost All Funds Drained Within Minutes", 
          detail: "Over 97% of money sent to this account is withdrawn or transferred within 3 minutes." 
        },
        { 
          label: "Pending Bank Freeze Warning", 
          detail: "Banks are currently reviewing this account to freeze it due to suspected fraud." 
        }
      ];
    } else if (cleaned.includes("scam") || cleaned.includes("fraud") || cleaned.includes("4491")) {
      riskScore = 76;
      flagged = true;
      holderName = "Vivek Singh";
      holderMasked = "V***k S***h";
      riskReasons = [
        { 
          label: "Linked to Fake Bill & Phishing Messages", 
          detail: "This account was reported in fake electricity bill disconnection and bonus reward SMS scams." 
        },
        { 
          label: "Sudden Abnormal Payments Spike", 
          detail: "A sudden high volume of payments is entering this personal account compared to its normal activity." 
        }
      ];
    } else if (cleaned.includes("merchant") || cleaned.includes("zomato") || cleaned.includes("amazon") || cleaned.includes("swiggy")) {
      riskScore = 4;
      flagged = false;
      holderName = "Zomato Verified Merchant";
      holderMasked = "Z****o M***t";
      riskReasons = [
        { 
          label: "Fully Verified Business Merchant", 
          detail: "This is a registered company account with full official bank KYC and government verification." 
        },
        { 
          label: "Trusted Transaction History", 
          detail: "Over 500,000+ safe payments completed with zero fraud reports." 
        }
      ];
    } else {
      // Default score for custom inputs
      riskScore = cleaned.length % 2 === 0 ? 18 : 68;
      flagged = riskScore > 50;
      holderName = cleaned.includes("@") ? cleaned.split("@")[0].replace(/[._]/g, " ").replace(/\b\w/g, c => c.toUpperCase()) : "Anil Verma";
      holderMasked = "A****t H****r";
      if (riskScore > 50) {
        riskReasons = [
          { 
            label: "Unusual Rush of Incoming Money", 
            detail: "This account is receiving money much faster than a normal personal account usually does." 
          },
          { 
            label: "Accessed from New or Unknown Devices", 
            detail: "Recent transactions were attempted from unusual locations or unfamiliar devices." 
          }
        ];
      } else {
        riskReasons = [
          { 
            label: "Normal & Safe Account History", 
            detail: "Daily payments and transfers look completely normal for a regular personal account." 
          },
          { 
            label: "Zero Complaints or Fraud Reports", 
            detail: "No complaints, disputes, or security alerts have ever been reported for this account." 
          }
        ];
      }
    }

    let complaintId = null;
    if (fileComplaint) {
      complaintId = `CMP-${103 + this.complaints.length}`;
      const newComplaint = {
        complaintId,
        filedBy: this.getCurrentUser()?.username || "customer_user",
        targetIdentifier: identifier,
        targetType: identifierType,
        riskScore,
        flagged,
        status: "NEW_SUBMISSION",
        filedAt: new Date().toISOString().replace("T", " ").substring(0, 19),
        holderName,
        holderMasked,
        details: `Customer pre-check flagged anomaly. Auto-filed dispute for investigation.`,
        linkedAccounts: [
          { accountNumber: `ACC-${Math.floor(10000 + Math.random() * 90000)}`, holderName, riskScore, status: flagged ? "FLAGGED" : "CLEAN" }
        ],
        transactionTrail: []
      };
      this.complaints.unshift(newComplaint);
    }

    return {
      riskScore,
      flagged,
      holderName,
      holderMasked,
      riskReasons,
      complaintId,
      identifier,
      identifierType,
      checkedAt: new Date().toISOString()
    };
  }

  // 4b. POST /api/complaints/file (Directly from Risk Result page)
  async fileComplaintDirect({ identifierType, identifier, riskScore, holderMasked, details }) {
    await this.delay(300);
    const complaintId = `CMP-${103 + this.complaints.length}`;
    const newComplaint = {
      complaintId,
      filedBy: this.getCurrentUser()?.username || "customer_user",
      targetIdentifier: identifier,
      targetType: identifierType || "upi",
      riskScore: riskScore || 75,
      flagged: true,
      status: "NEW_SUBMISSION",
      filedAt: new Date().toISOString().replace("T", " ").substring(0, 19),
      holderMasked: holderMasked || "Masked Beneficiary",
      details: details || `User flagged and disputed transaction to ${identifier} after risk score review.`,
      linkedAccounts: [
        { 
          accountNumber: identifier.startsWith("ACC-") ? identifier : `ACC-${Math.floor(10000 + Math.random() * 90000)}`, 
          holderName: holderMasked || "Disputed Beneficiary", 
          riskScore: riskScore || 75, 
          status: "FLAGGED" 
        }
      ],
      transactionTrail: []
    };
    this.complaints.unshift(newComplaint);
    return {
      success: true,
      complaintId,
      message: "Official fraud complaint filed with Bank SOC."
    };
  }

  // 5. GET /api/officer/complaints
  async getOfficerComplaints() {
    await this.delay(180);
    return this.complaints.map(c => ({
      complaintId: c.complaintId,
      filedBy: c.filedBy,
      targetIdentifier: c.targetIdentifier,
      holderName: c.holderName || c.holderMasked || "Account Holder",
      riskScore: c.riskScore,
      status: c.status,
      filedAt: c.filedAt
    }));
  }

  // 6. GET /api/officer/complaints/:id
  async getComplaintDetail(id) {
    await this.delay(200);
    const complaint = this.complaints.find(c => c.complaintId === id) || this.complaints[0];
    
    // Synchronize frozen statuses
    const updatedLinkedAccounts = (complaint.linkedAccounts || []).map(acc => ({
      ...acc,
      status: this.frozenAccounts.has(acc.accountNumber) ? "FROZEN" : acc.status
    }));

    return {
      ...complaint,
      linkedAccounts: updatedLinkedAccounts
    };
  }

  // 7. POST /api/officer/accounts/:accountNumber/freeze
  async freezeAccount(accountNumber, { reason = "Autonomous Taint / Multi-hop Pass-through Intercept" } = {}) {
    await this.delay(250);
    this.frozenAccounts.add(accountNumber);

    // Update in any complaints linked list
    this.complaints.forEach(c => {
      if (c.linkedAccounts) {
        c.linkedAccounts.forEach(acc => {
          if (acc.accountNumber === accountNumber) {
            acc.status = "FROZEN";
          }
        });
      }
      if (c.targetIdentifier.includes(accountNumber)) {
        c.status = "FROZEN";
      }
    });

    return {
      status: "frozen",
      accountNumber,
      reason,
      timestamp: new Date().toISOString()
    };
  }

  // Local Auth Session Helpers
  getCurrentUser() {
    try {
      const stored = localStorage.getItem("fraudshield_auth");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  }

  logout() {
    localStorage.removeItem("fraudshield_auth");
  }
}

export const api = new ApiService();
export default api;
