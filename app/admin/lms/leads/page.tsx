import Link from "next/link";
import { UserRoundSearch } from "lucide-react";
import { LeadDrawer } from "@/components/admin/lead-drawer";
import { QuotationDrawer } from "@/components/admin/quotation-drawer";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { listAdminCampaigns, listAdminLeads } from "@/lib/dashboard";
import { formatDate, formatINR } from "@/lib/utils";
import type { CampaignDTO, LeadDTO } from "@/types";

export default async function LeadsPage({ searchParams }: { searchParams: Promise<{ campaign?: string }> }) {
  const campaignId = (await searchParams).campaign;
  const [leads, campaigns] = await Promise.all([listAdminLeads(campaignId) as Promise<LeadDTO[]>, listAdminCampaigns() as Promise<CampaignDTO[]>]);
  const campaign = campaigns.find((item) => item._id === campaignId);
  return <div className="space-y-5"><div className="flex flex-wrap items-center justify-between gap-3"><div><h2 className="text-xl font-bold">Leads</h2><p className="text-sm text-muted-foreground">{campaign ? `${leads.length} leads from ${campaign.name}` : `${leads.length} total customer enquiries`}{campaign ? <> · <Link href="/admin/lms/leads" className="text-primary hover:underline">Clear filter</Link></> : null}</p></div><LeadDrawer campaigns={campaigns} defaultCampaignId={campaignId} /></div>
  {leads.length ? <Card><CardContent className="overflow-x-auto p-0"><table className="w-full text-sm"><thead><tr className="border-b text-left text-muted-foreground"><th className="p-4">Lead</th><th className="p-4">Customer</th><th className="p-4">Trip interest</th><th className="p-4">Source</th><th className="p-4">Status</th><th className="p-4">Quotation</th><th className="p-4 text-right">Action</th></tr></thead><tbody>{leads.map((lead) => { const sourceCampaign = typeof lead.campaign === "object" ? lead.campaign : null; const quotation = typeof lead.quotation === "object" ? lead.quotation : null; return <tr key={lead._id} className="border-b border-border/50 align-top hover:bg-secondary/40"><td className="p-4"><p className="font-mono text-xs">{lead.leadNumber}</p><p className="text-xs text-muted-foreground">{formatDate(lead.createdAt)}</p></td><td className="p-4"><p className="font-medium">{lead.customerName}</p><p className="text-xs text-muted-foreground">{lead.phone}{lead.email ? ` · ${lead.email}` : ""}</p></td><td className="p-4"><p>{lead.destination || "Not specified"}</p><p className="text-xs text-muted-foreground">{lead.travelers} traveler(s){lead.budget ? ` · ${formatINR(lead.budget)}` : ""}</p></td><td className="p-4"><p>{lead.source}</p>{sourceCampaign ? <Link className="text-xs text-primary hover:underline" href="/admin/campaigns">{sourceCampaign.name}</Link> : null}</td><td className="p-4"><StatusBadge status={lead.status} /></td><td className="p-4">{quotation ? <Link href="/admin/lms/quotations" className="font-mono text-xs text-primary hover:underline">{quotation.quotationNumber}</Link> : <QuotationDrawer leads={leads} leadId={lead._id} />}</td><td className="p-4 text-right"><LeadDrawer lead={lead} campaigns={campaigns} /></td></tr>; })}</tbody></table></CardContent></Card> : <EmptyState icon={UserRoundSearch} title="No leads yet" description="Add a lead manually or attribute one to a marketing campaign." action={<LeadDrawer campaigns={campaigns} defaultCampaignId={campaignId} />} />}</div>;
}
