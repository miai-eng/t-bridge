import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import { currentFiscalYear } from "@/lib/fiscal-year";

type Role = "homeroom" | "assistant" | "floating";

type StaffName = {
  family_name: string;
  given_name: string;
  family_name_romaji: string;
  given_name_romaji: string;
  primary_language: "ja" | "en";
};

type ClassroomRow = {
  id: string;
  name: string;
  age_group: number;
  children: { count: number }[];
  staff_assignments: { role: Role; staff: StaffName | null }[];
};

const ROLE_ORDER: Role[] = ["homeroom", "assistant", "floating"];

const ROLE_LABEL: Record<Role, string> = {
  homeroom: "Homeroom / 担任",
  assistant: "Assistant / 補助",
  floating: "Floating / フリー",
};

// Names already in Latin script (e.g. "Emily Carter") are shown given-first.
// Other names are shown as written (family-first) with romaji underneath,
// so staff who cannot read kanji can still identify the person.
function StaffNameDisplay({ s }: { s: StaffName }) {
  const isLatin =
    s.family_name === s.family_name_romaji &&
    s.given_name === s.given_name_romaji;
  if (isLatin) {
    return <span>{`${s.given_name} ${s.family_name}`}</span>;
  }
  return (
    <span>
      {`${s.family_name} ${s.given_name}`}
      <span className="ml-1 text-sm text-gray-500">
        ({`${s.family_name_romaji} ${s.given_name_romaji}`})
      </span>
    </span>
  );
}

async function ClassroomList() {
  const supabase = await createClient();
  const fiscalYear = currentFiscalYear();

  const { data, error } = await supabase
    .from("classrooms")
    .select(
      `id, name, age_group,
       children(count),
       staff_assignments(role, staff(family_name, given_name,
         family_name_romaji, given_name_romaji, primary_language))`,
    )
    .eq("fiscal_year", fiscalYear)
    .order("age_group")
    .order("name")
    .overrideTypes<ClassroomRow[], { merge: false }>();

  if (error) {
    return (
      <p className="rounded border border-red-300 bg-red-50 p-4 text-red-800">
        Could not load classrooms: {error.message}
      </p>
    );
  }

  if (!data || data.length === 0) {
    return (
      <p className="text-gray-600">
        No classrooms for fiscal year {fiscalYear}. Did you apply the
        migrations and seed?
      </p>
    );
  }

  return (
    <>
      <p className="mb-4 text-sm text-gray-600">
        Fiscal year {fiscalYear} (April {fiscalYear} – March {fiscalYear + 1})
      </p>
      <table className="w-full border-collapse text-left">
        <thead>
          <tr className="border-b border-gray-300 text-sm text-gray-600">
            <th className="py-2 pr-4">Classroom</th>
            <th className="py-2 pr-4">Age group</th>
            <th className="py-2 pr-4">Children</th>
            <th className="py-2">Staff</th>
          </tr>
        </thead>
        <tbody>
          {data.map((c) => {
            const assignments = [...c.staff_assignments]
              .filter((a) => a.staff)
              .sort(
                (a, b) =>
                  ROLE_ORDER.indexOf(a.role) - ROLE_ORDER.indexOf(b.role),
              );
            return (
              <tr key={c.id} className="border-b border-gray-200 align-top">
                <td className="py-3 pr-4 font-medium">{c.name}</td>
                <td className="py-3 pr-4">
                  {c.age_group}歳児
                  <span className="ml-1 text-sm text-gray-500">
                    (age {c.age_group})
                  </span>
                </td>
                <td className="py-3 pr-4">{c.children[0]?.count ?? 0}</td>
                <td className="py-3">
                  {assignments.length === 0 ? (
                    <span className="text-gray-500">No staff assigned</span>
                  ) : (
                    <ul className="space-y-1">
                      {assignments.map((a, i) => (
                        <li key={i}>
                          <span className="mr-2 inline-block min-w-36 text-sm text-gray-600">
                            {ROLE_LABEL[a.role]}
                          </span>
                          <StaffNameDisplay s={a.staff!} />
                          <span className="ml-2 rounded bg-gray-100 px-1.5 py-0.5 text-xs uppercase text-gray-600">
                            {a.staff!.primary_language}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
}

export default function Page() {
  return (
    <main className="mx-auto w-full max-w-5xl p-8">
      <h1 className="mb-1 text-2xl font-semibold">Classrooms / クラス一覧</h1>
      <Suspense fallback={<p className="text-gray-600">Loading…</p>}>
        <ClassroomList />
      </Suspense>
    </main>
  );
}
