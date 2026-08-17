import Image from "next/image";
import Link from "next/link";
import { Megaphone, Settings, UserRound, UsersRound, WalletCards } from "lucide-react";
import { connectDB } from "@/lib/db";
import { getSettings } from "@/models/Settings";
import { formatDate, formatINR, serialize } from "@/lib/utils";
import { SettingsForm } from "@/components/admin/settings-form";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { OfferCardRowActions } from "@/components/admin/offer-card-row-actions";
import { EmployeeRowActions } from "@/components/admin/employee-row-actions";
import { OfferCardDrawer } from "@/components/admin/offer-card-drawer";
import { EmployeeDrawer } from "@/components/admin/employee-drawer";
import { ChangePasswordForm } from "@/components/admin/change-password-form";
import { PayrollSection } from "@/components/admin/payroll-section";
import { DEFAULT_SETTINGS } from "@/lib/constants";
import { getCurrentUser } from "@/lib/session";
import { listAdminEmployees, listAdminOfferCards, listAdminPayroll } from "@/lib/dashboard";
import type { EmployeeDTO, OfferCardDTO, PayrollDTO } from "@/types";

const OFFER_FALLBACK = "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=200&q=60";

const SETTINGS_SECTIONS = [
  { key: "platform", label: "Platform Configuration", icon: Settings },
  { key: "offers", label: "Offer Cards", icon: Megaphone },
  { key: "employees", label: "Employees", icon: UsersRound },
  { key: "payroll", label: "Employee Payroll", icon: WalletCards },
  { key: "profile", label: "Profile", icon: UserRound },
] as const;

type SettingsSection = (typeof SETTINGS_SECTIONS)[number]["key"];
type SearchParams = Record<string, string | string[] | undefined>;

function str(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function sectionFromParams(params: SearchParams): SettingsSection {
  const section = str(params.section);
  return SETTINGS_SECTIONS.some((item) => item.key === section)
    ? section as SettingsSection
    : "platform";
}

export default async function AdminSettingsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const activeSection = sectionFromParams(params);
  const user = await getCurrentUser();

  let settings = { ...DEFAULT_SETTINGS };
  try {
    await connectDB();
    settings = serialize(await getSettings());
  } catch {
    /* fall back to defaults if DB unavailable */
  }

  const [offers, employees, payroll] = await Promise.all([
    activeSection === "offers" ? listAdminOfferCards() : Promise.resolve([]),
    activeSection === "employees" || activeSection === "payroll" ? listAdminEmployees() : Promise.resolve([]),
    activeSection === "payroll" ? listAdminPayroll() : Promise.resolve([]),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage platform, offers, employees and profile access</p>
      </div>

      <SettingsNav activeSection={activeSection} />

      {activeSection === "platform" ? (
        <SettingsForm
          settings={{
            defaultCommission: settings.defaultCommission,
            platformFeePercent: settings.platformFeePercent,
            platformFeeFlat: settings.platformFeeFlat,
            minWithdrawal: settings.minWithdrawal,
            currency: settings.currency,
          }}
        />
      ) : null}

      {activeSection === "offers" ? <OfferCardsSection offers={offers as OfferCardDTO[]} /> : null}

      {activeSection === "employees" ? <EmployeesSection employees={employees as EmployeeDTO[]} /> : null}

      {activeSection === "payroll" ? <PayrollSection payroll={payroll as PayrollDTO[]} employees={employees as EmployeeDTO[]} /> : null}

      {activeSection === "profile" ? <ChangePasswordForm email={user?.email} /> : null}
    </div>
  );
}

function SettingsNav({ activeSection }: { activeSection: SettingsSection }) {
  return (
    <Card>
      <CardContent className="flex gap-2 overflow-x-auto p-2">
        {SETTINGS_SECTIONS.map((item) => {
          const Icon = item.icon;
          const active = item.key === activeSection;

          return (
            <Link
              key={item.key}
              href={"/admin/settings?section=" + item.key}
              className={
                "flex min-w-max items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors " +
                (active
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground")
              }
            >
              <Icon className="size-4" />
              {item.label}
            </Link>
          );
        })}
      </CardContent>
    </Card>
  );
}

function OfferCardsSection({ offers }: { offers: OfferCardDTO[] }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">Offer Cards</h2>
          <p className="text-muted-foreground">Manage homepage carousel banners</p>
        </div>
        <OfferCardDrawer />
      </div>

      {offers.length ? (
        <Card>
          <CardContent className="overflow-x-auto p-0">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-muted-foreground">
                  <th className="p-4 font-medium">Offer</th>
                  <th className="p-4 font-medium">Target</th>
                  <th className="p-4 font-medium">Order</th>
                  <th className="p-4 font-medium">Status</th>
                  <th className="p-4 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {offers.map((offer) => (
                  <tr key={offer._id} className="border-b border-border/50 hover:bg-secondary/40">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <Image
                          src={offer.images?.[0] || OFFER_FALLBACK}
                          alt=""
                          width={72}
                          height={48}
                          className="h-12 w-20 rounded-lg object-cover"
                        />
                        <div>
                          <p className="font-medium">{offer.title}</p>
                          <p className="line-clamp-1 text-xs text-muted-foreground">{offer.description}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-muted-foreground">{offer.countryCode} · {offer.href}</td>
                    <td className="p-4">{offer.sortOrder}</td>
                    <td className="p-4"><StatusBadge status={offer.status} /></td>
                    <td className="p-4"><OfferCardRowActions offer={offer} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      ) : (
        <EmptyState
          icon={Megaphone}
          title="No offer cards yet"
          description="Create up to four active banners for the homepage carousel."
          action={<OfferCardDrawer />}
        />
      )}
    </div>
  );
}

function EmployeesSection({ employees }: { employees: EmployeeDTO[] }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">Employees</h2>
          <p className="text-muted-foreground">Manage internal team members, salaries and portal access</p>
        </div>
        <EmployeeDrawer />
      </div>

      {employees.length ? (
        <Card>
          <CardContent className="overflow-x-auto p-0">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-muted-foreground">
                  <th className="p-4 font-medium">Employee</th>
                  <th className="p-4 font-medium">Role</th>
                  <th className="p-4 font-medium">Portal</th>
                  <th className="p-4 font-medium">Salary</th>
                  <th className="p-4 font-medium">Joined</th>
                  <th className="p-4 font-medium">Status</th>
                  <th className="p-4 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {employees.map((employee) => (
                  <tr key={employee._id} className="border-b border-border/50 hover:bg-secondary/40">
                    <td className="p-4">
                      <p className="font-medium">{employee.name}</p>
                      <p className="text-xs text-muted-foreground">{employee.email} · {employee.mobile || "no mobile"}</p>
                    </td>
                    <td className="p-4">
                      <p>{employee.designation}</p>
                      <p className="text-xs text-muted-foreground">{employee.department}</p>
                    </td>
                    <td className="p-4">
                      <p className="font-medium">{employee.portalAccess ? "Enabled" : "No access"}</p>
                      <p className="text-xs text-muted-foreground">{employee.portalAccess ? (employee.portalPages?.length || 0) + " pages" : "-"}</p>
                    </td>
                    <td className="p-4 font-medium">{formatINR(employee.salary)}</td>
                    <td className="p-4 text-muted-foreground">{employee.joinedAt ? formatDate(employee.joinedAt) : "-"}</td>
                    <td className="p-4"><StatusBadge status={employee.status} /></td>
                    <td className="p-4"><EmployeeRowActions employee={employee} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      ) : (
        <EmptyState
          icon={UsersRound}
          title="No employees yet"
          description="Add employees to track team, salary and status."
          action={<EmployeeDrawer />}
        />
      )}
    </div>
  );
}
