from pathlib import Path
from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfgen import canvas
from reportlab.platypus import Paragraph
from reportlab.lib.styles import ParagraphStyle

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "output" / "pdf" / "Travels_OS_Features_and_Pricing.pdf"
OUT.parent.mkdir(parents=True, exist_ok=True)

NAVY = colors.HexColor("#10233C")
BLUE = colors.HexColor("#1E67F0")
TEAL = colors.HexColor("#28B8A5")
INK = colors.HexColor("#172033")
MUTED = colors.HexColor("#607086")
LINE = colors.HexColor("#DCE5F0")
PALE = colors.HexColor("#F5F8FC")
SKY = colors.HexColor("#EAF2FF")
WHITE = colors.white

regular = "/System/Library/Fonts/Supplemental/Arial.ttf"
bold = "/System/Library/Fonts/Supplemental/Arial Bold.ttf"
pdfmetrics.registerFont(TTFont("Brand", regular))
pdfmetrics.registerFont(TTFont("Brand-Bold", bold))

c = canvas.Canvas(str(OUT), pagesize=A4)
c.setTitle("Travels OS - Features and Pricing")
c.setAuthor("Travels OS")
W, H = A4

def rect(x, y, w, h, fill, stroke=LINE, radius=3 * mm, sw=0.7):
    c.setFillColor(fill); c.setStrokeColor(stroke); c.setLineWidth(sw)
    c.roundRect(x, y, w, h, radius, fill=1, stroke=1)

def txt(x, y, text, size=9, color=INK, font="Brand"):
    c.setFont(font, size); c.setFillColor(color); c.drawString(x, y, text)

def para(x, y_top, w, text, size=8, leading=10.5, color=INK, font="Brand"):
    style = ParagraphStyle("p", fontName=font, fontSize=size, leading=leading, textColor=color)
    p = Paragraph(text, style)
    _, h = p.wrap(w, 200 * mm)
    p.drawOn(c, x, y_top - h)
    return h

M = 15 * mm
content_w = W - 2 * M

# Hero
c.setFillColor(NAVY)
c.rect(0, H - 62 * mm, W, 62 * mm, fill=1, stroke=0)
txt(M, H - 17 * mm, "TRAVELS", 14, WHITE, "Brand-Bold")
txt(M + 66, H - 17 * mm, "OS", 14, colors.HexColor("#64A0FF"), "Brand-Bold")
txt(M, H - 29 * mm, "THE OPERATING SYSTEM FOR TRAVEL BUSINESSES", 7.5, colors.HexColor("#71D8CA"), "Brand-Bold")
txt(M, H - 41 * mm, "Sell more journeys. Run everything in one place.", 19, WHITE, "Brand-Bold")
para(M, H - 47 * mm, 158 * mm,
     "A complete web platform for travel agencies and tour operators - from leads and quotations to bookings, payments, operations and growth.",
     8.5, 11.5, colors.HexColor("#C9D6E7"))

# Feature grid
y = H - 69 * mm
txt(M, y, "ONE CONNECTED PLATFORM", 8, BLUE, "Brand-Bold")
y -= 7 * mm
features = [
    ("Sales & customer journey", "Public travel website, packages, destinations, search, itineraries, galleries, reviews, enquiries, CRM leads and shareable quotations."),
    ("Bookings & traveler portal", "Direct and partner bookings, status tracking, seat pricing, Razorpay verification, wishlists and personal traveler dashboards."),
    ("Operations & inventory", "Trips, itineraries, events, destinations, suppliers, visa applications and organized operational records in one workspace."),
    ("Finance & reporting", "Earnings, expenses, invoices, payroll, commissions, visual dashboards and downloadable CSV/PDF business reports."),
    ("Partner resale network", "Branded partner pages, custom resale links, attributed bookings, configurable platform fees and partner earnings ledgers."),
    ("Business management", "Marketing campaigns, reputation records, HRM, attendance, leave, performance and role-based employee access."),
]
gap = 4 * mm
card_w = (content_w - gap) / 2
card_h = 27 * mm
for i, (title, desc) in enumerate(features):
    col = i % 2; row = i // 2
    x = M + col * (card_w + gap)
    cy = y - row * (card_h + 3 * mm) - card_h
    rect(x, cy, card_w, card_h, PALE)
    txt(x + 4 * mm, cy + card_h - 7 * mm, title, 9, NAVY, "Brand-Bold")
    para(x + 4 * mm, cy + card_h - 10 * mm, card_w - 8 * mm, desc, 7.1, 9.2, MUTED)

# Pricing
y_price_title = y - 3 * (card_h + 3 * mm) - 3 * mm
txt(M, y_price_title, "SIMPLE MONTHLY PRICING", 8, BLUE, "Brand-Bold")
txt(M + 48 * mm, y_price_title, "Hosting, maintenance and support included", 7.5, MUTED)

plans_y = y_price_title - 46 * mm
plan_gap = 3 * mm
plan_w = (content_w - 2 * plan_gap) / 3
plans = [
    ("STARTER", "INR 1,699", "per month", ["Travel website & catalog", "Bookings + traveler portal", "CRM leads & quotations", "Basic reports", "Up to 3 staff users"]),
    ("STANDARD", "INR 2,999", "per month", ["Everything in Starter", "Finance & invoices", "Visa + campaign tracking", "Advanced exports", "Up to 8 staff users"]),
    ("BUSINESS", "CUSTOM", "contact us", ["Everything in Standard", "Partner resale portal", "White-label pages", "Commission + HRM tools", "Tailored users & rollout"]),
]
for i, (name, price, note, items) in enumerate(plans):
    x = M + i * (plan_w + plan_gap)
    fill = SKY if i == 1 else PALE
    rect(x, plans_y, plan_w, 41 * mm, fill, colors.HexColor("#BCD3FF") if i == 1 else LINE)
    if i == 1:
        txt(x + 4 * mm, plans_y + 35.7 * mm, "MOST POPULAR", 6.3, TEAL, "Brand-Bold")
    txt(x + 4 * mm, plans_y + 30 * mm, name, 8.5, NAVY, "Brand-Bold")
    txt(x + 4 * mm, plans_y + 22.2 * mm, price, 15, NAVY, "Brand-Bold")
    txt(x + 4 * mm, plans_y + 17.4 * mm, note, 6.8, MUTED)
    item_html = "<br/>".join([f"<font color='#1E67F0'>&#8226;</font>&nbsp; {v}" for v in items])
    para(x + 4 * mm, plans_y + 14.2 * mm, plan_w - 8 * mm, item_html, 6.6, 8.3, INK)

# Onboarding and commercial strip
lower_y = plans_y - 5 * mm
txt(M, lower_y, "ONBOARDING INCLUDED", 7.8, BLUE, "Brand-Bold")
para(M + 44 * mm, lower_y + 1 * mm, content_w - 44 * mm,
     "Brand setup  |  Production deployment  |  Initial admin configuration  |  Payment gateway setup support  |  Team orientation  |  30-day implementation support",
     7, 9.2, INK)

note_y = lower_y - 19 * mm
rect(M, note_y, content_w, 14 * mm, colors.HexColor("#E8F8F5"), TEAL, 2 * mm)
para(M + 4 * mm, note_y + 11 * mm, content_w - 8 * mm,
     "<b>Need more?</b> Multiple brands, custom integrations, mobile apps, additional users, data migration and source-code licensing are available by quotation.",
     7.2, 9.3, NAVY)

# Footer terms
terms_y = note_y - 8 * mm
c.setStrokeColor(LINE); c.line(M, terms_y, W - M, terms_y)
para(M, terms_y - 3 * mm, content_w,
     "Prices are indicative and exclude GST. Domain, payment-gateway fees, SMS, WhatsApp, email and other third-party services are additional. Subscription billing begins at production launch. Custom development is quoted separately. Client business data remains the client's data; product IP and source code remain with Travels OS unless separately licensed.",
     6.4, 8.3, MUTED)
txt(M, 8 * mm, "TRAVELS OS", 7.5, NAVY, "Brand-Bold")
c.setFillColor(MUTED); c.setFont("Brand", 6.7); c.drawRightString(W - M, 8 * mm, "Features & Pricing  |  2026")

c.showPage(); c.save()
print(OUT)
