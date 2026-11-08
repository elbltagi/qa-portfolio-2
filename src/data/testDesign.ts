/**
 * Test design technique reference.
 *
 * IMPORTANT: unlike every other data file on this site, these are NOT
 * delivered project artefacts. The project's 603 cases were written directly
 * into module workbooks without recording which formal technique produced
 * each one, so no technique specimen exists to publish.
 *
 * What follows is the team's declared methodology, illustrated against real
 * Toolshop modules so the examples are concrete. Each specimen says which
 * module it relates to and what that module actually produced. Every page
 * that renders these labels them as illustrative.
 */

export type Verdict = 'valid' | 'invalid';

export interface Partition {
  label: string;
  kind: Verdict;
  representative: string;
  expected: string;
}

export interface BoundaryPoint {
  value: string;
  position: string;
  verdict: Verdict;
}

export interface DecisionRule {
  id: string;
  conditions: string[];
  action: string;
  outcome: Verdict;
}

export interface DecisionTable {
  conditions: string[];
  rules: DecisionRule[];
}

export interface StateTransition {
  from: string;
  event: string;
  to: string;
  kind: 'happy' | 'guard';
}

export interface DesignedTestCase {
  id: string;
  title: string;
  precondition: string;
  steps: string[];
  data: string;
  expected: string;
  priority: 'High' | 'Medium' | 'Low';
  negative: boolean;
}

export interface TechniqueSpecimen {
  id: string;
  name: string;
  abbreviation: string;
  rationale: string;
  /** The real module this example is drawn against. */
  moduleId: string;
  moduleName: string;
  /** The specific input or flow being illustrated. */
  underTest: string;
  /** What that module actually produced in the delivered run. */
  actualResult: string;
  partitions?: Partition[];
  boundaries?: BoundaryPoint[];
  decisionTable?: DecisionTable;
  transitions?: StateTransition[];
  cases: DesignedTestCase[];
  reduction?: { exhaustive: string; designed: string; note: string };
}

/** Shown wherever these specimens appear. */
export const illustrativeNotice =
  'These are illustrative worked examples of the techniques the team applied, drawn against real Toolshop modules. They are not delivered project artefacts — the 603 executed cases live in the module workbooks and do not record which technique produced each one.';

export const techniqueSpecimens: TechniqueSpecimen[] = [
  {
    id: 'ep',
    name: 'Equivalence Partitioning',
    abbreviation: 'EP',
    rationale:
      'Divide an input into classes the system should treat identically, then test one representative per class instead of every value.',
    moduleId: 'US-006',
    moduleName: 'Customer Registration',
    underTest: 'Email address field on the customer registration form',
    actualResult:
      'The registration module ran 135 cases and recorded 32 failures, 2 of them in the email area — the largest failure count of any module.',
    partitions: [
      {
        label: 'Well-formed, not yet registered',
        kind: 'valid',
        representative: 'qa.toolshop.01@example.com',
        expected: 'Accepted; registration proceeds',
      },
      {
        label: 'Well-formed, already registered',
        kind: 'invalid',
        representative: 'existing.customer@example.com',
        expected: 'Inline error: address already in use',
      },
      {
        label: 'Missing @ separator',
        kind: 'invalid',
        representative: 'qa.toolshop.example.com',
        expected: 'Inline validation error; form not submitted',
      },
      {
        label: 'Missing domain part',
        kind: 'invalid',
        representative: 'qa.toolshop@',
        expected: 'Inline validation error; form not submitted',
      },
      {
        label: 'Empty / whitespace only',
        kind: 'invalid',
        representative: '"   "',
        expected: 'Required-field error',
      },
    ],
    cases: [
      {
        id: 'EP-01',
        title: 'Register with a well-formed, unused email address',
        precondition: 'No account exists for the chosen address',
        steps: [
          'Open the registration page',
          'Complete every mandatory field with valid data',
          'Enter the representative address in the Email field',
          'Submit the form',
        ],
        data: 'qa.toolshop.01@example.com',
        expected: 'Account is created and a confirmation state is shown',
        priority: 'High',
        negative: false,
      },
      {
        id: 'EP-02',
        title: 'Reject an address already bound to an account',
        precondition: 'An account already exists for the address',
        steps: ['Enter the already-registered address', 'Submit the form'],
        data: 'existing.customer@example.com',
        expected: 'Submission blocked with a duplicate-address message',
        priority: 'High',
        negative: true,
      },
      {
        id: 'EP-03',
        title: 'Reject an address with no @ separator',
        precondition: 'Registration form is open',
        steps: ['Enter the malformed address', 'Move focus away from the field'],
        data: 'qa.toolshop.example.com',
        expected: 'Field-level validation error; submission prevented',
        priority: 'High',
        negative: true,
      },
      {
        id: 'EP-04',
        title: 'Reject an empty email field',
        precondition: 'Registration form is open',
        steps: ['Leave the Email field blank', 'Submit the form'],
        data: '(empty)',
        expected: 'Required-field error; submission prevented',
        priority: 'High',
        negative: true,
      },
    ],
    reduction: {
      exhaustive: 'Unbounded',
      designed: '5 classes → 4 cases',
      note: 'One representative per class covers the same defect space as thousands of arbitrary strings.',
    },
  },
  {
    id: 'bva',
    name: 'Boundary Value Analysis',
    abbreviation: 'BVA',
    rationale:
      'Defects cluster at the edges of a range. Test the values immediately either side of each boundary, plus the boundary itself.',
    moduleId: 'US-001',
    moduleName: 'Home Page',
    underTest: 'Price slider on the product catalogue',
    actualResult:
      'The price slider area ran 13 cases: 12 passed and 1 was blocked. It was one of the stronger areas of the Home Page module.',
    boundaries: [
      { value: 'Below minimum', position: 'Drag handle past the left stop', verdict: 'invalid' },
      { value: 'Minimum', position: 'Lowest selectable price', verdict: 'valid' },
      { value: 'Minimum + 1', position: 'Just above the lower stop', verdict: 'valid' },
      { value: 'Maximum − 1', position: 'Just below the upper stop', verdict: 'valid' },
      { value: 'Maximum', position: 'Highest selectable price', verdict: 'valid' },
      { value: 'Above maximum', position: 'Drag handle past the right stop', verdict: 'invalid' },
      { value: 'Inverted range', position: 'Lower handle dragged above upper', verdict: 'invalid' },
    ],
    cases: [
      {
        id: 'BVA-01',
        title: 'Filter at the minimum selectable price',
        precondition: 'Catalogue page is open with the full product list shown',
        steps: ['Drag the lower handle to the far left', 'Read the result count'],
        data: 'Minimum boundary',
        expected: 'All products priced at or above the minimum are listed',
        priority: 'High',
        negative: false,
      },
      {
        id: 'BVA-02',
        title: 'Filter at the maximum selectable price',
        precondition: 'Catalogue page is open',
        steps: ['Drag the upper handle to the far right', 'Read the result count'],
        data: 'Maximum boundary',
        expected: 'The full catalogue remains listed',
        priority: 'High',
        negative: false,
      },
      {
        id: 'BVA-03',
        title: 'Handles cannot be dragged past their stops',
        precondition: 'Catalogue page is open',
        steps: ['Attempt to drag each handle beyond its stop'],
        data: 'Outside boundary',
        expected: 'The handle clamps at the stop; no invalid range is produced',
        priority: 'Medium',
        negative: true,
      },
      {
        id: 'BVA-04',
        title: 'Lower handle cannot cross the upper handle',
        precondition: 'Catalogue page is open',
        steps: ['Drag the lower handle above the upper handle'],
        data: 'Inverted range',
        expected: 'The range is prevented or normalised; results stay coherent',
        priority: 'Medium',
        negative: true,
      },
    ],
    reduction: {
      exhaustive: 'Every price point',
      designed: '7 points → 4 cases',
      note: 'Edge-focused selection finds off-by-one defects that random sampling misses.',
    },
  },
  {
    id: 'decision',
    name: 'Decision Table Testing',
    abbreviation: 'DT',
    rationale:
      'When an outcome depends on a combination of conditions, tabulate the combinations so no rule is left untested.',
    moduleId: 'US-005',
    moduleName: 'Checkout, Address and Payment',
    underTest: 'Eligibility to reach the order confirmation step',
    actualResult:
      'This module has 72 cases written and reviewed and zero executed. The rules below were never exercised — this is exactly the coverage the project did not achieve.',
    decisionTable: {
      conditions: ['Cart has items', 'Signed in', 'Billing address complete', 'Payment method chosen'],
      rules: [
        {
          id: 'R1',
          conditions: ['Y', 'Y', 'Y', 'Y'],
          action: 'Confirmation step is reachable',
          outcome: 'valid',
        },
        {
          id: 'R2',
          conditions: ['Y', 'Y', 'Y', 'N'],
          action: 'Blocked — payment method required',
          outcome: 'invalid',
        },
        {
          id: 'R3',
          conditions: ['Y', 'Y', 'N', '—'],
          action: 'Blocked — billing address required',
          outcome: 'invalid',
        },
        {
          id: 'R4',
          conditions: ['Y', 'N', '—', '—'],
          action: 'Redirected to the sign-in step',
          outcome: 'invalid',
        },
        {
          id: 'R5',
          conditions: ['N', '—', '—', '—'],
          action: 'Blocked — empty-cart message',
          outcome: 'invalid',
        },
      ],
    },
    cases: [
      {
        id: 'DT-01',
        title: 'Reach confirmation when every condition holds',
        precondition: 'Cart holds one item and the customer is signed in',
        steps: [
          'Proceed to checkout',
          'Complete the billing address',
          'Select a payment method',
          'Continue to the confirmation step',
        ],
        data: 'Rule R1',
        expected: 'Order summary and confirmation controls are shown',
        priority: 'High',
        negative: false,
      },
      {
        id: 'DT-02',
        title: 'Block confirmation when no payment method is chosen',
        precondition: 'Cart and address complete; no payment selected',
        steps: ['Attempt to continue from the payment step'],
        data: 'Rule R2',
        expected: 'Progress is blocked with a payment-method prompt',
        priority: 'High',
        negative: true,
      },
      {
        id: 'DT-03',
        title: 'Redirect an unauthenticated customer to sign in',
        precondition: 'Cart holds one item; no session',
        steps: ['Open the checkout URL directly'],
        data: 'Rule R4',
        expected: 'Customer is returned to the sign-in step',
        priority: 'High',
        negative: true,
      },
      {
        id: 'DT-04',
        title: 'Block checkout from an empty cart',
        precondition: 'Cart is empty',
        steps: ['Open the checkout URL directly'],
        data: 'Rule R5',
        expected: 'Empty-cart message is shown; checkout is not entered',
        priority: 'High',
        negative: true,
      },
    ],
    reduction: {
      exhaustive: '16 combinations',
      designed: '5 collapsed rules',
      note: "Don't-care entries collapse impossible or equivalent combinations without losing coverage.",
    },
  },
  {
    id: 'state',
    name: 'State Transition Testing',
    abbreviation: 'ST',
    rationale:
      'Model the system as states and events so that both the permitted paths and the transitions that must be refused are covered.',
    moduleId: 'US-007',
    moduleName: 'Authentication and Password Recovery',
    underTest: 'Customer authentication session lifecycle',
    actualResult:
      'This module ran 32 cases with 31 passing — the highest pass rate in the project. It is also the only module that was never statically reviewed.',
    transitions: [
      { from: 'Anonymous', event: 'Submit valid credentials', to: 'Authenticated', kind: 'happy' },
      { from: 'Anonymous', event: 'Submit invalid credentials', to: 'Anonymous', kind: 'guard' },
      { from: 'Anonymous', event: 'Sign in with Google', to: 'Authenticated', kind: 'happy' },
      { from: 'Anonymous', event: 'Request password reset', to: 'Recovery requested', kind: 'happy' },
      { from: 'Recovery requested', event: 'Set a new password', to: 'Anonymous', kind: 'happy' },
      { from: 'Authenticated', event: 'Sign out', to: 'Anonymous', kind: 'happy' },
      { from: 'Authenticated', event: 'Open account page', to: 'Authenticated', kind: 'happy' },
    ],
    cases: [
      {
        id: 'ST-01',
        title: 'Anonymous to Authenticated with valid credentials',
        precondition: 'A registered account exists; no active session',
        steps: ['Open the sign-in page', 'Enter valid credentials', 'Submit'],
        data: 'Valid email and password',
        expected: 'Account page is reached and sign-out becomes available',
        priority: 'High',
        negative: false,
      },
      {
        id: 'ST-02',
        title: 'Remain Anonymous after invalid credentials',
        precondition: 'No active session',
        steps: ['Enter a valid email with the wrong password', 'Submit'],
        data: 'Valid user, wrong password',
        expected: 'Error is shown and no session is established',
        priority: 'High',
        negative: true,
      },
      {
        id: 'ST-03',
        title: 'Authenticated to Anonymous on sign out',
        precondition: 'An authenticated session is active',
        steps: ['Select sign out', 'Navigate back to an account-only page'],
        data: '—',
        expected: 'Session ends and the account page is no longer reachable',
        priority: 'High',
        negative: false,
      },
      {
        id: 'ST-04',
        title: 'Account-only page is refused while Anonymous',
        precondition: 'No active session',
        steps: ['Request an account-only URL directly'],
        data: 'Order history URL',
        expected: 'Customer is redirected to sign in rather than shown the page',
        priority: 'High',
        negative: true,
      },
    ],
    reduction: {
      exhaustive: '4 states × 7 events',
      designed: '7 transitions → 4 cases',
      note: 'Covers every valid transition plus the refusals that protect account data.',
    },
  },
];
