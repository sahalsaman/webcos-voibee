from pathlib import Path
from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.platypus import BaseDocTemplate, Frame, PageTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "output/pdf/TRAVEL_ERP_Features_and_Pricing.pdf"
OUT.parent.mkdir(parents=True, exist_ok=True)

NAVY = colors.HexColor("#102A43")
BLUE = colors.HexColor("#2878FF")
CYAN = colors.HexColor("#18B6C9")
INK = colors.HexColor("#243B53")
MUTED = colors.HexColor("#627D98")
PALE = colors.HexColor("#EEF6FF")
MINT = colors.HexColor("#EAFBF8")
LINE = colors.HexColor("#D9E2EC")
WHITE = colors.white

s = getSampleStyleSheet()
s.add(ParagraphStyle(name="Cover", fontName="Helvetica-Bold", fontSize=33, leading=39, textColor=NAVY, spaceAfter=14))
s.add(ParagraphStyle(name="Brand", fontName="Helvetica-Bold", fontSize=30, leading=35, textColor=NAVY, spaceAfter=20))
s.add(ParagraphStyle(name="Eyebrow", fontName="Helvetica-Bold", fontSize=10, leading=13, textColor=BLUE, tracking=1.1, spaceAfter=10))
s.add(ParagraphStyle(name="Sub", fontName="Helvetica", fontSize=13, leading=19, textColor=MUTED, spaceAfter=20))
s.add(ParagraphStyle(name="H1", fontName="Helvetica-Bold", fontSize=21, leading=26, textColor=NAVY, spaceAfter=7))
s.add(ParagraphStyle(name="Intro", fontName="Helvetica", fontSize=10.5, leading=15, textColor=MUTED, spaceAfter=14))
s.add(ParagraphStyle(name="CardH", fontName="Helvetica-Bold", fontSize=10.5, leading=14, textColor=NAVY, spaceAfter=4))
s.add(ParagraphStyle(name="Body", fontName="Helvetica", fontSize=8.7, leading=12.3, textColor=INK))
s.add(ParagraphStyle(name="Small", fontName="Helvetica", fontSize=7.5, leading=10.5, textColor=MUTED))
s.add(ParagraphStyle(name="WhiteH", fontName="Helvetica-Bold", fontSize=19, leading=24, textColor=WHITE, alignment=TA_CENTER))
s.add(ParagraphStyle(name="White", fontName="Helvetica", fontSize=9.5, leading=14, textColor=WHITE, alignment=TA_CENTER))
s.add(ParagraphStyle(name="Center", fontName="Helvetica", fontSize=8.5, leading=12, textColor=MUTED, alignment=TA_CENTER))
s.add(ParagraphStyle(name="Plan", fontName="Helvetica-Bold", fontSize=13, leading=16, textColor=BLUE, alignment=TA_CENTER))
s.add(ParagraphStyle(name="Price", fontName="Helvetica-Bold", fontSize=19, leading=22, textColor=NAVY, alignment=TA_CENTER))
s.add(ParagraphStyle(name="WhiteCard", fontName="Helvetica-Bold", fontSize=10, leading=13, textColor=WHITE))

def P(text, style="Body"):
    return Paragraph(text, s[style])

def header_footer(canvas, doc):
    if doc.page == 1:
        return
    canvas.saveState()
    w, h = A4
    canvas.setStrokeColor(LINE)
    canvas.line(18*mm, h-15*mm, w-18*mm, h-15*mm)
    canvas.setFont("Helvetica-Bold", 15)
    canvas.setFillColor(NAVY)
    canvas.drawString(18*mm, h-10.5*mm, "TRAVEL ERP")
    canvas.setFont("Helvetica", 7.5)
    canvas.setFillColor(MUTED)
    canvas.drawRightString(w-18*mm, h-10*mm, "Travel Business Management Platform")
    canvas.line(18*mm, 13*mm, w-18*mm, 13*mm)
    canvas.drawString(18*mm, 8*mm, "TRAVEL ERP | Built for modern Indian travel businesses")
    canvas.drawRightString(w-18*mm, 8*mm, str(doc.page))
    canvas.restoreState()

def section(title, intro):
    return [P(title, "H1"), P(intro, "Intro")]

def card(title, body, tint=WHITE):
    t = Table([[P(title, "CardH")], [P(body)]], colWidths=[78*mm])
    t.setStyle(TableStyle([
        ("BACKGROUND", (0,0), (-1,-1), tint), ("BOX", (0,0), (-1,-1), .7, LINE),
        ("LEFTPADDING", (0,0), (-1,-1), 9), ("RIGHTPADDING", (0,0), (-1,-1), 9),
        ("TOPPADDING", (0,0), (-1,-1), 7), ("BOTTOMPADDING", (0,0), (-1,-1), 7),
    ]))
    return t

def grid(items):
    rows=[]
    for i in range(0, len(items), 2):
        rows.append([card(*items[i], PALE if i%4==0 else WHITE), card(*items[i+1], MINT if i%4==0 else WHITE)])
    t=Table(rows, colWidths=[82*mm,82*mm])
    t.setStyle(TableStyle([("VALIGN",(0,0),(-1,-1),"TOP"),("LEFTPADDING",(0,0),(-1,-1),0),("RIGHTPADDING",(0,0),(-1,-1),4),("TOPPADDING",(0,0),(-1,-1),4),("BOTTOMPADDING",(0,0),(-1,-1),4)]))
    return t

def plan(name, monthly, yearly, audience, points, highlight=False):
    name_style=ParagraphStyle("x"+name,parent=s["Plan"],textColor=WHITE if highlight else BLUE)
    rows=[[Paragraph(name,name_style)],[P(audience,"Center")],[P(f"Rs. {monthly}<font size='9'> / month</font>","Price")],[P(f"or <b>Rs. {yearly} / year</b><br/><font color='#18B6C9'>Save 2 months</font>","Center")]]
    rows += [[P("<font color='#18B6C9'><b>✓</b></font> "+x)] for x in points]
    t=Table(rows,colWidths=[53*mm])
    t.setStyle(TableStyle([("BACKGROUND",(0,0),(0,0),BLUE if highlight else PALE),("BOX",(0,0),(-1,-1),1 if highlight else .7,BLUE if highlight else LINE),("LEFTPADDING",(0,0),(-1,-1),9),("RIGHTPADDING",(0,0),(-1,-1),9),("TOPPADDING",(0,0),(-1,-1),7),("BOTTOMPADDING",(0,0),(-1,-1),7),("VALIGN",(0,0),(-1,-1),"TOP")]))
    return t

doc=BaseDocTemplate(str(OUT),pagesize=A4,rightMargin=18*mm,leftMargin=18*mm,topMargin=27*mm,bottomMargin=17*mm,title="TRAVEL ERP Features and Pricing",author="TRAVEL ERP")
frame=Frame(doc.leftMargin,doc.bottomMargin,doc.width,doc.height,id="main")
doc.addPageTemplates(PageTemplate(id="main",frames=frame,onPage=header_footer))
story=[]

# Cover
story += [Spacer(1,20*mm),P("TRAVEL ERP","Brand"),P("TRAVEL BUSINESS SOFTWARE FOR INDIA","Eyebrow"),P("Run your entire travel business from one place.","Cover"),P("From enquiries and quotations to bookings, operations, finance, employees and partner sales - TRAVEL ERP brings your complete workflow into one simple platform.","Sub")]
hero=Table([[P("SELL MORE","WhiteH"),P("WORK SMARTER","WhiteH"),P("GROW FASTER","WhiteH")],[P("Marketplace, quotations and white-label partner links","White"),P("One connected system instead of scattered spreadsheets","White"),P("Affordable plans designed for Indian travel companies","White")]],colWidths=[55*mm]*3)
hero.setStyle(TableStyle([("BACKGROUND",(0,0),(-1,-1),NAVY),("VALIGN",(0,0),(-1,-1),"TOP"),("LEFTPADDING",(0,0),(-1,-1),10),("RIGHTPADDING",(0,0),(-1,-1),10),("TOPPADDING",(0,0),(-1,-1),14),("BOTTOMPADDING",(0,0),(-1,-1),14),("LINEBEFORE",(1,0),(2,-1),.5,colors.HexColor("#486581"))]))
story += [hero,Spacer(1,12*mm),P("Made for tour operators, travel agencies, DMCs, holiday planners, community-trip organizers and travel resellers.","Center"),Spacer(1,27*mm),P("PRODUCT BROCHURE  |  FEATURES  |  PRICING  |  SUPPORT","Eyebrow"),PageBreak()]

# Value
story += section("Everything your team needs. Fully connected.","TRAVEL ERP replaces disconnected spreadsheets, chats and tools with one shared source of truth - from the first customer enquiry to the final trip and payment report.")
journey=Table([[P("1. ATTRACT","WhiteCard"),P("2. CONVERT","WhiteCard"),P("3. DELIVER","WhiteCard"),P("4. CONTROL","WhiteCard")],[P("Website, destinations, packages, offers and partner storefronts"),P("Leads, quotations, follow-ups, booking and payment"),P("Tickets, hotels, visas, documents and confirmations"),P("Finance, HRM, reports, reviews and settings")]],colWidths=[41*mm]*4)
journey.setStyle(TableStyle([("BACKGROUND",(0,0),(-1,0),NAVY),("BACKGROUND",(0,1),(-1,1),PALE),("GRID",(0,0),(-1,-1),.5,LINE),("VALIGN",(0,0),(-1,-1),"TOP"),("LEFTPADDING",(0,0),(-1,-1),8),("RIGHTPADDING",(0,0),(-1,-1),8),("TOPPADDING",(0,0),(-1,-1),9),("BOTTOMPADDING",(0,0),(-1,-1),9)]))
story += [journey,Spacer(1,7*mm)] + section("Why travel businesses choose TRAVEL ERP","Built around real travel operations, not adapted from a generic CRM.")
story += [grid([
    ("One travel operating system","CRM, booking, operations, inventory, finance, HRM, partner sales and reports work together."),
    ("Your own public marketplace","Showcase destinations and packages with rich itineraries, galleries, filters and mobile-first pages."),
    ("Unique white-label reseller network","Partners sell your packages through branded links while every booking and commission stays traceable."),
    ("India-ready commercial model","INR pricing, Razorpay-ready checkout, WhatsApp-friendly sharing and affordable subscriptions."),
    ("No per-booking platform commission","Your subscription stays predictable. Payment-gateway charges and optional services remain separate."),
    ("Role-based team access","Give admins and employees only the pages they need, with HR manager and own-record access controls."),
]),PageBreak()]

# Sales
story += section("Sell and serve customers better","A smooth journey for travelers and a faster workflow for your sales and operations team.")
story += [grid([
    ("Website and package marketplace","Homepage, destinations, package listing, search, filters, trip detail, itinerary, inclusions, galleries and related packages."),
    ("Lead management","Capture enquiries, source, owner, status, expected value and campaign; search and filter the complete pipeline."),
    ("Professional quotations","Create customer-specific itinerary quotations with pricing, validity, terms, policy and secure public share links."),
    ("Bookings and payments","Online or staff-created bookings, Razorpay verification, payment status, edits, cancellations and refunds."),
    ("Customer records","See customer profile, booking history, paid value, latest activity, travelers and itineraries in one view."),
    ("Booking confirmations and PDFs","Generate shareable booking confirmations and package PDFs for customers and your operations team."),
    ("Ticket tracking","Manage flight, train, bus, cruise and other ticket requests with route, schedule, provider and references."),
    ("Hotel reservation tracking","Follow hotel requests from enquiry to confirmation, stay and checkout, including rooms and guests."),
    ("Visa tracking","Monitor applications, destinations, documentation and progress so deadlines do not get missed."),
    ("Traveler self-service","Customers can view bookings, track trip status and save packages to a personal wishlist."),
]),Spacer(1,4*mm),P("COMING NEXT","Eyebrow"),P("Planned modules include complete flight discovery and personalized custom-trip requests.","Intro"),PageBreak()]

# Management
story += [Spacer(1,6*mm)] + section("Control the business behind every trip","Give management a live view of inventory, people, money, marketing and customer reputation.")
story += [grid([
    ("Package inventory","Create fixed-date or flexible packages with pricing, seats, media, services, itinerary and publishing controls."),
    ("Destination, hotel and vehicle inventory","Maintain destination content and organize accommodation, transport and supplier resources."),
    ("Supplier management","Track suppliers, category, contacts, location, commission rate, notes and status."),
    ("Finance dashboard","Review paid-booking earnings, revenue indicators, expenses, invoices and outstanding amounts."),
    ("Expenses and invoices","Create and update categorized expenses and customer invoices with due dates and payment status."),
    ("Business reporting","Export booking and operating data to CSV/Excel and generate print-ready PDF reports."),
    ("Marketing campaigns","Plan channel, audience, schedule, budget and ownership, then connect campaigns to generated leads."),
    ("Reputation management","Monitor ratings, sentiment, unresolved feedback, response ownership and escalations."),
    ("Employee and access management","Maintain employee profiles, departments, salary, status and granular portal access."),
    ("Complete HRM","Attendance, regularization, leave approvals, payroll, tasks and performance reviews."),
])]
callout=Table([[P("BUILT-IN MANAGEMENT VISIBILITY","WhiteH")],[P("Connected dashboards and status workflows help owners stay informed without chasing updates.","White")]],colWidths=[164*mm])
callout.setStyle(TableStyle([("BACKGROUND",(0,0),(-1,-1),NAVY),("LEFTPADDING",(0,0),(-1,-1),16),("RIGHTPADDING",(0,0),(-1,-1),16),("TOPPADDING",(0,0),(-1,-1),7),("BOTTOMPADDING",(0,0),(-1,-1),7)]))
story += [Spacer(1,5*mm),callout,PageBreak()]

# Unique
story += section("A reseller engine that makes TRAVEL ERP different","Turn agencies, creators and community leaders into a measurable distribution channel for your packages.")
steps=[("1","Publish a package","Create it once with the operator base price."),("2","Partner creates a branded link","The partner selects the package and adds an approved commission."),("3","Traveler books","The customer sees the final price on the branded storefront."),("4","Revenue splits automatically","The system records operator revenue, partner earnings and platform fees.")]
st=Table([[P(f"<font color='#2878FF'><b>{n}</b></font>","Price"),P(t,"CardH"),P(d)] for n,t,d in steps],colWidths=[15*mm,48*mm,101*mm])
st.setStyle(TableStyle([("GRID",(0,0),(-1,-1),.5,LINE),("BACKGROUND",(0,0),(0,-1),PALE),("VALIGN",(0,0),(-1,-1),"MIDDLE"),("LEFTPADDING",(0,0),(-1,-1),9),("RIGHTPADDING",(0,0),(-1,-1),9),("TOPPADDING",(0,0),(-1,-1),10),("BOTTOMPADDING",(0,0),(-1,-1),10)]))
story += [st,Spacer(1,7*mm),grid([
    ("Partner storefronts","Every partner gets a branded storefront and package pages with your platform attribution."),
    ("Link-level commissions","Set a different commission for every partner-package relationship while protecting your base price."),
    ("Automatic attribution","Bookings through partner links are credited correctly without manual reconciliation."),
    ("Transparent earnings ledger","Partners and admins see pending and paid commissions with booking context."),
    ("Predictable customer pricing","Platform fees are deducted from partner commission instead of unexpectedly raising traveler prices."),
    ("Direct booking support","Bookings without a partner remain direct operator sales with zero partner commission."),
]),Spacer(1,6*mm)]
example=Table([[P("EXAMPLE","CardH"),P("Base package","Small"),P("Partner commission","Small"),P("Traveler price","Small")],[P("Per traveler"),P("Rs. 10,000","CardH"),P("+ Rs. 1,000","CardH"),P("Rs. 11,000","CardH")]],colWidths=[35*mm,43*mm,43*mm,43*mm])
example.setStyle(TableStyle([("BACKGROUND",(0,0),(-1,0),PALE),("GRID",(0,0),(-1,-1),.5,LINE),("ALIGN",(1,0),(-1,-1),"CENTER"),("VALIGN",(0,0),(-1,-1),"MIDDLE"),("LEFTPADDING",(0,0),(-1,-1),8),("RIGHTPADDING",(0,0),(-1,-1),8),("TOPPADDING",(0,0),(-1,-1),9),("BOTTOMPADDING",(0,0),(-1,-1),9)]))
story += [example,PageBreak()]

# Pricing
story += [Spacer(1,7*mm)] + section("Simple, affordable subscription plans","Introductory India launch pricing. Choose monthly flexibility or save two months with annual billing.")
plans=Table([[
    plan("STARTER","2,499","24,990","For solo agents and small teams",["Up to 3 team users","Leads, quotations and customers","Packages and bookings","Ticket, hotel and visa tracking","Basic reports","Email and WhatsApp support"]),
    plan("GROWTH","4,999","49,990","Best for growing agencies",["Up to 10 team users","Everything in Starter","Finance and invoice tools","Campaigns and reputation","HRM and payroll","Partner links and commissions","Priority onboarding and support"],True),
    plan("PRO","8,999","89,990","For established operators and DMCs",["Up to 25 team users","Everything in Growth","Advanced access controls","Full white-label partner network","Data-import assistance","Quarterly workflow review","Priority support"])
]],colWidths=[55*mm]*3)
plans.setStyle(TableStyle([("VALIGN",(0,0),(-1,-1),"TOP"),("LEFTPADDING",(0,0),(-1,-1),1.5),("RIGHTPADDING",(0,0),(-1,-1),1.5)]))
benefit=Table([[P("LAUNCH BENEFITS","CardH"),P("No setup fee for standard onboarding | Free guided product setup | Cancel monthly plans anytime | Annual plans include two months free")]],colWidths=[38*mm,126*mm])
benefit.setStyle(TableStyle([("BACKGROUND",(0,0),(-1,-1),MINT),("BOX",(0,0),(-1,-1),.7,CYAN),("VALIGN",(0,0),(-1,-1),"MIDDLE"),("LEFTPADDING",(0,0),(-1,-1),10),("RIGHTPADDING",(0,0),(-1,-1),10),("TOPPADDING",(0,0),(-1,-1),9),("BOTTOMPADDING",(0,0),(-1,-1),9)]))
story += [plans,Spacer(1,6*mm),benefit,Spacer(1,4*mm),P("Prices exclude applicable GST. Payment gateway fees, messaging credits, custom integrations, bulk migration and usage beyond plan limits may be billed separately. Enterprise pricing is available for larger teams, multiple brands or custom deployments.","Small"),PageBreak()]

# Support
story += section("Support that helps your team succeed","Onboarding and ongoing assistance designed for busy Indian travel teams.")
story += [grid([
    ("Guided onboarding","We help configure your business profile, settings, workflow and initial users."),
    ("Team training","Live remote walkthroughs help sales, operations, accounts and management learn their workflow."),
    ("Data setup assistance","We guide your team in preparing packages, customers and operating data for import or entry."),
    ("WhatsApp and email help","Get practical assistance through familiar channels during published support hours."),
    ("Priority support for Growth and Pro","Higher plans receive priority handling for issues affecting daily operations."),
    ("Continuous improvements","TRAVEL ERP evolves with product updates and new travel-business capabilities."),
]),Spacer(1,8*mm)] + section("A better way to run your travel company","Spend less time maintaining spreadsheets and chasing updates. Give customers a professional buying experience and your team one reliable operating system.")
cta=Table([[P("READY TO SEE TRAVEL ERP FOR YOUR BUSINESS?","WhiteH")],[P("Book a personalized demo and we will map TRAVEL ERP to your current sales, booking and operations workflow.","White")],[P("Contact the TRAVEL ERP team for demo availability and launch-plan eligibility.","White")]],colWidths=[164*mm])
cta.setStyle(TableStyle([("BACKGROUND",(0,0),(-1,-1),NAVY),("LEFTPADDING",(0,0),(-1,-1),18),("RIGHTPADDING",(0,0),(-1,-1),18),("TOPPADDING",(0,0),(-1,-1),12),("BOTTOMPADDING",(0,0),(-1,-1),12)]))
story += [cta,Spacer(1,8*mm),P("TRAVEL ERP - Marketplace, CRM, operations, finance, HRM and partner sales in one platform.","Center")]

doc.build(story)
print(OUT)
