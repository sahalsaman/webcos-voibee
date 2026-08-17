from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfbase import pdfmetrics
from reportlab.platypus import (
    BaseDocTemplate, Frame, PageTemplate, Paragraph, Spacer, Table, TableStyle,
    PageBreak, KeepTogether, HRFlowable,
)


ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "output" / "pdf" / "Travels_OS_Features_and_Pricing.pdf"
OUT.parent.mkdir(parents=True, exist_ok=True)

NAVY = colors.HexColor("#10233C")
BLUE = colors.HexColor("#1E67F0")
SKY = colors.HexColor("#EAF2FF")
CYAN = colors.HexColor("#39C6B4")
INK = colors.HexColor("#172033")
MUTED = colors.HexColor("#607086")
LINE = colors.HexColor("#DDE5EF")
PALE = colors.HexColor("#F6F8FB")
WHITE = colors.white

font_regular = "/System/Library/Fonts/Supplemental/Arial.ttf"
font_bold = "/System/Library/Fonts/Supplemental/Arial Bold.ttf"
if Path(font_regular).exists():
    pdfmetrics.registerFont(TTFont("Brand", font_regular))
    pdfmetrics.registerFont(TTFont("Brand-Bold", font_bold))
else:
    font_regular, font_bold = "Helvetica", "Helvetica-Bold"

styles = getSampleStyleSheet()
BODY = ParagraphStyle("body", fontName="Brand", fontSize=9.2, leading=13, textColor=INK)
SMALL = ParagraphStyle("small", parent=BODY, fontSize=7.7, leading=10.5, textColor=MUTED)
EYEBROW = ParagraphStyle("eyebrow", parent=BODY, fontName="Brand-Bold", fontSize=8.5, leading=11,
                         textColor=BLUE, spaceAfter=7)
H1 = ParagraphStyle("h1", parent=BODY, fontName="Brand-Bold", fontSize=29, leading=32, textColor=NAVY)
H2 = ParagraphStyle("h2", parent=BODY, fontName="Brand-Bold", fontSize=19, leading=23, textColor=NAVY,
                    spaceAfter=8)
H3 = ParagraphStyle("h3", parent=BODY, fontName="Brand-Bold", fontSize=11.5, leading=14, textColor=NAVY)
CENTER = ParagraphStyle("center", parent=BODY, alignment=TA_CENTER)


def footer(canvas, doc):
    canvas.saveState()
    w, h = A4
    canvas.setStrokeColor(LINE)
    canvas.line(18 * mm, 14 * mm, w - 18 * mm, 14 * mm)
    canvas.setFont("Brand", 7.5)
    canvas.setFillColor(MUTED)
    canvas.drawString(18 * mm, 9 * mm, "Travels OS  |  Features & Pricing")
    canvas.drawRightString(w - 18 * mm, 9 * mm, f"{doc.page}")
    canvas.restoreState()


doc = BaseDocTemplate(
    str(OUT), pagesize=A4, rightMargin=18 * mm, leftMargin=18 * mm,
    topMargin=16 * mm, bottomMargin=19 * mm, title="Travels OS - Features and Pricing",
    author="Travels OS",
)
frame = Frame(doc.leftMargin, doc.bottomMargin, doc.width, doc.height, id="main")
doc.addPageTemplates([PageTemplate(id="standard", frames=frame, onPage=footer)])


def p(text, style=BODY):
    return Paragraph(text, style)


def bullet(text):
    return p(f'<font color="#1E67F0">&#8226;</font>&nbsp;&nbsp;{text}', BODY)


def feature_card(title, desc, tag=""):
    tag_html = f'<br/><font color="#1E67F0" size="7.5"><b>{tag}</b></font>' if tag else ""
    cell = p(f"<b>{title}</b><br/><font color='#607086' size='8'>{desc}</font>{tag_html}", BODY)
    return Table([[cell]], colWidths=[83 * mm], rowHeights=[31 * mm], style=[
        ("BACKGROUND", (0, 0), (-1, -1), PALE), ("BOX", (0, 0), (-1, -1), 0.7, LINE),
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"), ("LEFTPADDING", (0, 0), (-1, -1), 10),
        ("RIGHTPADDING", (0, 0), (-1, -1), 10),
    ])


story = []

# Cover
story += [Spacer(1, 15 * mm), p("TRAVELS <font color='#1E67F0'>OS</font>",
          ParagraphStyle("logo", parent=H3, fontSize=16, leading=18)), Spacer(1, 27 * mm),
          p("THE OPERATING SYSTEM FOR TRAVEL BUSINESSES", EYEBROW),
          p("Sell more journeys.<br/>Run everything in one place.", H1), Spacer(1, 9 * mm),
          p("A complete web platform for travel agencies, tour operators and reseller networks - from lead capture and quotations to bookings, payments, operations and growth.",
            ParagraphStyle("lead", parent=BODY, fontSize=12, leading=18, textColor=MUTED)), Spacer(1, 14 * mm)]

cover_stats = Table([
    [p("3", ParagraphStyle("stat", parent=H2, alignment=TA_CENTER, textColor=BLUE)),
     p("12+", ParagraphStyle("stat", parent=H2, alignment=TA_CENTER, textColor=BLUE)),
     p("1", ParagraphStyle("stat", parent=H2, alignment=TA_CENTER, textColor=BLUE))],
    [p("role-based portals", SMALL), p("business modules", SMALL), p("connected platform", SMALL)],
], colWidths=[55 * mm] * 3, style=[("ALIGN", (0, 0), (-1, -1), "CENTER"),
    ("BACKGROUND", (0, 0), (-1, -1), SKY), ("BOX", (0, 0), (-1, -1), 0.8, colors.HexColor("#BCD3FF")),
    ("INNERGRID", (0, 0), (-1, -1), 0.6, colors.HexColor("#BCD3FF")),
    ("TOPPADDING", (0, 0), (-1, 0), 12), ("BOTTOMPADDING", (0, 1), (-1, 1), 12)])
story += [cover_stats, Spacer(1, 34 * mm), HRFlowable(width="100%", color=LINE), Spacer(1, 7 * mm),
          p("Features & Pricing  |  2026 Edition", SMALL), PageBreak()]

# Features page 1
story += [p("ONE PLATFORM. EVERY WORKFLOW.", EYEBROW), p("Built around the way travel businesses work", H2),
          p("Travels OS connects sales, fulfillment, finance and customer experience so your team can move faster without juggling disconnected tools."), Spacer(1, 7 * mm)]
cards = [
    feature_card("Public travel storefront", "Responsive website, destinations, packages, trip search, rich itineraries, galleries, reviews and SEO-ready pages."),
    feature_card("Lead & quotation management", "Capture enquiries, organize leads, create professional quotations and share them through secure customer links."),
    feature_card("Bookings & payments", "Manage direct and partner bookings, booking status, seat pricing and Razorpay payment verification."),
    feature_card("Inventory & operations", "Manage itineraries, events, suppliers, destinations and operational records from a central workspace."),
    feature_card("Traveler portal", "Give travelers a personal dashboard for bookings, wishlists, upcoming trips and completed journeys."),
    feature_card("Reports & dashboards", "Track performance with visual dashboards and export business reports in CSV or PDF formats."),
]
for i in range(0, len(cards), 2):
    story += [Table([[cards[i], cards[i + 1]]], colWidths=[85 * mm, 85 * mm], style=[
        ("VALIGN", (0, 0), (-1, -1), "TOP"), ("LEFTPADDING", (0, 0), (-1, -1), 0),
        ("RIGHTPADDING", (0, 0), (0, -1), 2), ("LEFTPADDING", (1, 0), (1, -1), 2),
    ]), Spacer(1, 4 * mm)]
story += [PageBreak()]

# Features page 2
story += [p("GO BEYOND BOOKINGS", EYEBROW), p("Control the whole business", H2), Spacer(1, 3 * mm)]
rows = [
    ("Partner resale network", "Partners browse packages, create branded sales links, track bookings and view earnings."),
    ("White-label selling", "Partner storefronts carry partner branding while your platform remains the operating backbone."),
    ("Commission engine", "Automatically split partner earnings and operator revenue with configurable platform fees."),
    ("Finance workspace", "Monitor earnings, expenses, invoices and payroll from dedicated finance views."),
    ("Visa tracking", "Record and follow visa applications through an organized administrative workflow."),
    ("Marketing campaigns", "Plan and track campaigns alongside your customers, packages and operational data."),
    ("Reputation management", "Maintain review and reputation records from the admin portal."),
    ("HR & employee access", "Manage employee records, attendance, leave, payroll, performance and page-level access."),
]
feature_table = []
for title, desc in rows:
    feature_table.append([p(f"<b>{title}</b>", BODY), p(desc, BODY)])
tbl = Table(feature_table, colWidths=[52 * mm, 118 * mm], repeatRows=0, style=[
    ("BACKGROUND", (0, 0), (-1, -1), WHITE), ("ROWBACKGROUNDS", (0, 0), (-1, -1), [PALE, WHITE]),
    ("LINEBELOW", (0, 0), (-1, -1), 0.5, LINE), ("VALIGN", (0, 0), (-1, -1), "TOP"),
    ("TOPPADDING", (0, 0), (-1, -1), 9), ("BOTTOMPADDING", (0, 0), (-1, -1), 9),
    ("LEFTPADDING", (0, 0), (-1, -1), 7), ("RIGHTPADDING", (0, 0), (-1, -1), 7),
])
story += [tbl, Spacer(1, 8 * mm)]
role_box = Table([[p("ADMIN", EYEBROW), p("PARTNER", EYEBROW), p("TRAVELER", EYEBROW)],
                  [p("Run sales, operations, users, finance and reporting.", SMALL),
                   p("Sell packages, manage branded links and track earnings.", SMALL),
                   p("Discover, book and manage personal journeys.", SMALL)]],
                 colWidths=[56.6 * mm] * 3, style=[("BACKGROUND", (0, 0), (-1, -1), SKY),
                 ("BOX", (0, 0), (-1, -1), 0.8, colors.HexColor("#BCD3FF")),
                 ("INNERGRID", (0, 0), (-1, -1), 0.6, colors.HexColor("#BCD3FF")),
                 ("VALIGN", (0, 0), (-1, -1), "TOP"), ("TOPPADDING", (0, 0), (-1, -1), 9),
                 ("BOTTOMPADDING", (0, 0), (-1, -1), 9), ("LEFTPADDING", (0, 0), (-1, -1), 9),
                 ("RIGHTPADDING", (0, 0), (-1, -1), 9)])
story += [role_box, PageBreak()]

# Pricing
story += [p("SIMPLE, COMMERCIAL PRICING", EYEBROW), p("Choose the right plan", H2),
          p("Flexible monthly pricing in INR, designed for a single travel business brand. Taxes and third-party services are additional."), Spacer(1, 7 * mm)]

plans = [
    ("STARTER", "INR 1,699", "per month", ["Travel website & package catalog", "Trip and destination management", "Bookings & traveler portal", "Lead management & quotations", "Basic dashboard and reports", "Up to 3 staff users"]),
    ("STANDARD", "INR 2,999", "per month", ["Everything in Starter", "Finance, invoices & expenses", "Visa and campaign tracking", "Supplier and event management", "Advanced reports & exports", "Up to 8 staff users"]),
    ("BUSINESS", "CUSTOM", "contact us", ["Everything in Standard", "Partner portal & resale links", "White-label partner pages", "Commission & earnings engine", "HRM, payroll & reputation tools", "Users and rollout tailored to you"]),
]
plan_cells = []
for idx, (name, price, price_note, features) in enumerate(plans):
    popular = "<font color='#39C6B4' size='7'><b>MOST POPULAR</b></font><br/>" if idx == 1 else ""
    feature_html = "<br/>".join([f"<font color='#1E67F0'>&#8226;</font>&nbsp; {x}" for x in features])
    content = p(f"{popular}<font size='12'><b>{name}</b></font><br/><br/><font size='18' color='#10233C'><b>{price}</b></font><br/><font size='7.5' color='#607086'>{price_note}</font><br/><br/><font size='8' color='#607086'>Hosting, maintenance & support included</font><br/><br/>{feature_html}",
                ParagraphStyle("plan", parent=BODY, fontSize=8, leading=13))
    plan_cells.append(content)
pricing = Table([plan_cells], colWidths=[56.6 * mm] * 3, style=[
    ("BACKGROUND", (0, 0), (-1, -1), PALE), ("BACKGROUND", (1, 0), (1, 0), SKY),
    ("BOX", (0, 0), (-1, -1), 0.8, LINE), ("INNERGRID", (0, 0), (-1, -1), 0.8, LINE),
    ("VALIGN", (0, 0), (-1, -1), "TOP"), ("TOPPADDING", (0, 0), (-1, -1), 12),
    ("BOTTOMPADDING", (0, 0), (-1, -1), 12), ("LEFTPADDING", (0, 0), (-1, -1), 10),
    ("RIGHTPADDING", (0, 0), (-1, -1), 10),
])
story += [pricing, Spacer(1, 8 * mm), p("ONBOARDING INCLUDES", EYEBROW)]
setup = Table([[bullet("Brand colors, logo and business details"), bullet("Production deployment and database setup")],
               [bullet("Admin configuration and initial user setup"), bullet("Payment gateway configuration support")],
               [bullet("Online handover and team orientation"), bullet("30 days of post-launch implementation support")]],
              colWidths=[85 * mm, 85 * mm], style=[("VALIGN", (0, 0), (-1, -1), "TOP"),
              ("TOPPADDING", (0, 0), (-1, -1), 3), ("BOTTOMPADDING", (0, 0), (-1, -1), 3)])
story += [setup, Spacer(1, 6 * mm), p("Need multiple brands, custom integrations, a mobile app, extra users or source-code licensing? Ask for an Enterprise quotation.",
          ParagraphStyle("callout", parent=BODY, textColor=NAVY, backColor=colors.HexColor("#E8F8F5"), borderColor=CYAN,
                         borderWidth=0.8, borderPadding=9)), PageBreak()]

# Terms and CTA
story += [p("CLEAR FROM DAY ONE", EYEBROW), p("Commercial notes", H2), Spacer(1, 2 * mm)]
notes = [
    ("Billing", "Subscription billing begins when the production site goes live. Any custom onboarding or migration work will be quoted before implementation."),
    ("Taxes", "GST and other applicable taxes are charged additionally."),
    ("Third-party charges", "Domain, paid hosting upgrades, SMS, WhatsApp, email, payment-gateway fees, Cloudinary and other external services are billed separately."),
    ("Content & data", "The client supplies brand assets, policies, package content and legal information. Bulk migration or data entry can be quoted separately."),
    ("Customization", "Plan pricing covers configuration of the existing Travels OS product. New modules, integrations and workflow changes require a separate estimate."),
    ("Support", "Monthly service covers hosting administration, routine maintenance, backups and reasonable product support. It does not include unlimited custom development."),
    ("Ownership", "Client business data remains the client's data. Product IP, reusable components and source code remain with Travels OS unless a separate license states otherwise."),
]
for title, desc in notes:
    story += [KeepTogether([p(title.upper(), EYEBROW), p(desc), Spacer(1, 4 * mm)])]

story += [Spacer(1, 5 * mm), Table([[p("READY TO MODERNIZE YOUR TRAVEL BUSINESS?", EYEBROW),
          p("Book a product demonstration and receive a plan tailored to your team, sales model and rollout goals.",
            ParagraphStyle("cta", parent=BODY, fontSize=11, leading=16, textColor=WHITE))]], colWidths=[50 * mm, 120 * mm],
          style=[("BACKGROUND", (0, 0), (-1, -1), NAVY), ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
                 ("TOPPADDING", (0, 0), (-1, -1), 13), ("BOTTOMPADDING", (0, 0), (-1, -1), 13),
                 ("LEFTPADDING", (0, 0), (-1, -1), 12), ("RIGHTPADDING", (0, 0), (-1, -1), 12)])]

doc.build(story)
print(OUT)
