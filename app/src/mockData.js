// Stand-in for the Airtable "Contacts" table until real credentials are wired in.
// Shape matches what the Make.com scenario is documented as pulling from Airtable.
export const mockContacts = [
  {
    id: "rec001",
    name: "Alice Turner",
    phone: "+447700900001",
    topic: "renewing their postal subscription",
    lastContacted: "2026-08-02",
  },
  {
    id: "rec002",
    name: "Ben Okafor",
    phone: "+447700900002",
    topic: "a delayed parcel delivery",
    lastContacted: "2026-08-15",
  },
  {
    id: "rec003",
    name: "Chidi Adeyemi",
    phone: "+447700900003",
    topic: "a new service announcement",
    lastContacted: null,
  },
  {
    id: "rec004",
    name: "Dana Whitfield",
    phone: "+447700900004",
    topic: "a re-engagement offer after 60 days inactive",
    lastContacted: "2026-06-30",
  },
];
