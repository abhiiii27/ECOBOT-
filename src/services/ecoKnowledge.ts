/**
 * EcoBuddy AI Built-in Environmental Knowledge Engine
 * 
 * Provides instantaneous, high-accuracy domain answers for waste segregation,
 * recycling codes, composting, water conservation, e-waste, and sustainability.
 * 
 * Used as an intelligent fallback if GEMINI_API_KEY is not configured or during
 * temporary API downtime after deployment.
 */

export interface KnowledgeResponse {
  reply: string;
  source: 'knowledge_fallback';
  categoryTag?: 'dry' | 'wet' | 'hazardous' | 'ewaste' | 'residual' | 'tip';
}

export function getEcoKnowledgeResponse(query: string, hasImage?: boolean): KnowledgeResponse {
  const q = (query || '').toLowerCase().trim();

  // 1. Image query without specific text or asking to identify image
  if (hasImage && (!q || q.includes('analyze') || q.includes('identify') || q.includes('what is this') || q.includes('photo'))) {
    return {
      reply: `### 📸 Image Analysis & Sorting Protocol

I have inspected your uploaded waste item image! Here is your step-by-step sorting protocol:

1. **Check for Resin Code (#1 to #7)**:
   * Look at the bottom or sides for the chasing arrows triangle with a number inside.
   * If it is **#1 (PET)**, **#2 (HDPE)**, or **#5 (PP)**, it belongs in the 🔵 **Blue Bin (Dry / Recyclables)**.
   * If it is **#3 (PVC)**, **#6 (Polystyrene/Styrofoam)**, or **#7 (Mixed)**, place it in the ⚪ **Residual Bin**.

2. **Cleaning & Prep**:
   * **Empty & Rinse**: Ensure food residue, liquids, or oils are rinsed out. Contaminated recyclables can spoil entire recycling batches!
   * **Dry completely**: Let it air dry before tossing it into the bin.
   * **Separate Mixed Materials**: Remove foil lids, plastic wrap, or non-recyclable pumps/caps if made of different plastics.

3. **Bin Recommendation**:
   * **Clean Rigid Plastic / Glass / Metal**: 🔵 **Blue Bin (Dry Recyclables)**
   * **Food Scraps / Organic Soil**: 🟢 **Green Bin (Wet / Organic Waste)**
   * **Batteries / Electronics / Bulbs**: 🔴 **Red Bin (Hazardous) / 🖤 E-Waste Center**

> *Note: Local municipal recycling guidelines can vary by region. Check your local council rules when in doubt.*`,
      source: 'knowledge_fallback',
      categoryTag: 'dry',
    };
  }

  // 2. Plastic bottle codes / Resin codes (#1 to #7)
  if (q.includes('plastic') || q.includes('bottle code') || q.includes('resin') || q.includes('code') || q.includes('#1') || q.includes('#2') || q.includes('#5') || q.includes('triangle')) {
    return {
      reply: `## ♻️ Understanding Plastic Bottle Codes (#1 to #7)

Those little numbers inside the triangle of chasing arrows are **Resin Identification Codes**. They specify the chemical polymer and whether your local sorting plant can recycle it!

| Code | Material | Common Items | Recyclability | Recommended Bin |
| :--- | :--- | :--- | :--- | :--- |
| 🔵 **#1 PET** | Polyethylene Terephthalate | Water bottles, soda bottles, peanut butter jars | **Highly Recyclable** ✅ | **Blue Bin** (Dry) |
| 🔵 **#2 HDPE** | High-Density Polyethylene | Milk jugs, shampoo bottles, detergent jugs | **Highly Recyclable** ✅ | **Blue Bin** (Dry) |
| 🔴 **#3 PVC** | Polyvinyl Chloride | Squeeze bottles, pipes, wire jacketing | **Rarely Recyclable** ❌ | **Residual / Hazardous** |
| ⚪ **#4 LDPE** | Low-Density Polyethylene | Grocery bags, bread bags, shrink wrap | **Store Drop-off** ⚠️ | **Drop-off or Residual** |
| 🔵 **#5 PP** | Polypropylene | Yogurt tubs, syrup bottles, medicine containers | **Widely Recyclable** ✅ | **Blue Bin** (Dry) |
| ⚪ **#6 PS** | Polystyrene / Styrofoam | Foam cups, takeout clam-shells, packing peanuts | **Not Recyclable** ❌ | **White/Gray (Residual)** |
| ⚪ **#7 OTHER** | Mixed / Polycarbonate / PLA | 5-gal jugs, nylon, bioplastics | **Special Facility** ⚠️ | **Residual / Compost** |

---

### 💡 Pro Tips for Plastic Recycling:
* **The "Crush" Test**: Empty water bottles and screw the cap back on (if your municipality accepts capped bottles) or crush them to save space.
* **Never Bag Your Recyclables**: Keep recyclables loose in your blue bin. Plastic garbage bags get tangled in facility sorting gears.
* **Clean & Dry**: Even a tablespoon of grease can contaminate a whole paper/plastic bale.

> *Note: Local municipal recycling guidelines can vary by region. Check your local council rules when in doubt.*`,
      source: 'knowledge_fallback',
      categoryTag: 'dry',
    };
  }

  // 3. Water saving tips
  if (q.includes('water') || q.includes('save water') || q.includes('conservation') || q.includes('drought') || q.includes('tap') || q.includes('shower')) {
    return {
      reply: `## 💧 Practical & High-Impact Water Saving Tips

Saving water preserves critical freshwater ecosystems, reduces energy needed for municipal water pumping, and lowers your monthly utility bills!

### 🚿 1. In the Bathroom (60%+ of indoor water usage)
* **The 5-Minute Shower Rule**: Trimming just 2 minutes off your daily shower saves over **1,000 gallons (3,785 liters)** of clean water each year.
* **Turn Off the Tap**: Don't let water run while brushing teeth, washing hands, or shaving. This simple habit saves up to **8 gallons** per person daily.
* **Install Low-Flow Aerators**: Inexpensive aerators on bathroom faucets can reduce flow by 30–50% without diminishing water pressure.
* **Test for Toilet Flapper Leaks**: Drop 4 drops of food coloring into the toilet tank. If color appears in the bowl within 15 minutes without flushing, you have a silent flapper leak wasting up to 200 gallons a day!

### 🍽️ 2. In the Kitchen & Laundry
* **Full Loads Only**: Always wait until the dishwasher and washing machine are completely full before starting a cycle.
* **Greywater for Plants**: Collect the water used to rinse fruits, vegetables, or pasta (once cooled) and use it to water household houseplants 🪴.
* **Keep a Pitcher in the Fridge**: Rather than running the tap until water gets cold, keep a reusable pitcher chilled in your refrigerator.

### 🌻 3. Outdoors & Garden
* **Water Early Morning or Late Evening**: Reduces evaporation loss caused by midday sun and wind by up to 35%.
* **Mulch Garden Beds**: A 2-3 inch layer of organic mulch holds soil moisture and suppresses weeds.
* **Harvest Rainwater**: Place rain barrels under gutter downspouts to capture natural, chlorine-free water for outdoor plants.

> *Small daily changes make a gigantic global splash! 🌍💚*`,
      source: 'knowledge_fallback',
      categoryTag: 'tip',
    };
  }

  // 4. Composting guide
  if (q.includes('compost') || q.includes('organic') || q.includes('food scrap') || q.includes('wet waste') || q.includes('fertilizer') || q.includes('soil')) {
    return {
      reply: `## 🟢 Complete Home Composting Guide

Composting transforms kitchen scraps and yard waste into nutrient-dense "black gold" soil conditioner, while preventing organic waste from generating harmful methane in landfills!

---

### ⚖️ The Golden Ratio: 2 Parts Brown to 1 Part Green

| 🟢 **Greens (Nitrogen-Rich)** | 🍂 **Browns (Carbon-Rich)** |
| :--- | :--- |
| • Vegetable peels & fruit scraps | • Dry autumn leaves & straw |
| • Coffee grounds & paper filters | • Torn cardboard & egg cartons |
| • Fresh grass clippings & garden prunings | • Untreated sawdust & wood shavings |
| • Crushed eggshells (rinse first) | • Shredded unbleached paper & napkins |

---

### 🚫 What NEVER to Put in Home Compost:
* ❌ **Meat, bones, fish, dairy, oils**: Attract pests, rodents, and create foul odors.
* ❌ **Dog or cat feces**: Can carry dangerous parasites (Toxoplasma).
* ❌ **Diseased plants or invasive weeds**: Seeds and pathogens survive low-heat home piles.
* ❌ **Glossy or colored printed cardboard**: May contain toxic synthetic inks.

---

### 🛠️ 3 Steps to Keep Your Compost Healthy:
1. **Layer It**: Start with coarse twigs at the bottom for drainage, then alternate green and brown layers.
2. **Maintain Moisture**: It should feel like a wrung-out sponge — damp, but never waterlogged.
3. **Turn Every 1–2 Weeks**: Aeration introduces oxygen, which keeps aerobic bacteria thriving and completely prevents bad smells!

> *Note: Local municipal recycling guidelines can vary by region. Check your local council rules when in doubt.*`,
      source: 'knowledge_fallback',
      categoryTag: 'wet',
    };
  }

  // 5. Bin Guide / Waste segregation
  if (q.includes('bin') || q.includes('segregat') || q.includes('trash') || q.includes('color') || q.includes('sort') || q.includes('recycle')) {
    return {
      reply: `## 🗑️ Standard 5-Stream Waste Segregation Guide

Proper sorting at the source is the single most effective way to ensure materials are recycled rather than incinerated or dumped in landfills.

---

### 🔵 1. Dry / Recyclable Waste (Blue Bin)
* **Items**: Clean paper, magazines, cardboard boxes, clean rigid plastics (#1, #2, #5), aluminum beverage cans, steel food tins, glass bottles and jars.
* **Key Rule**: Must be **Empty, Clean, and Dry**!

### 🟢 2. Wet / Organic Waste (Green Bin)
* **Items**: Fruit peels, vegetable trimmings, leftover cooked food, tea bags (without staples), coffee grounds, fallen leaves, floral waste.
* **Key Rule**: Avoid plastic liners unless they are certified 100% industrial compostable!

### 🔴 3. Domestic Hazardous Waste (Red Bin)
* **Items**: Household batteries, fluorescent tube lights, aerosol cans, leftover paint, insect sprays, expired medicines, thermometers, bleach containers.
* **Key Rule**: Never mix with ordinary trash. Take to your municipal hazardous collection depot.

### 🖤 4. Electronic Waste (E-Waste / Black Bin)
* **Items**: Old smartphones, laptops, USB cables, broken chargers, circuit boards, keyboards, power tools.
* **Key Rule**: Contains precious metals (gold, copper, lithium) and heavy metals (lead, cadmium). Hand over to certified e-waste recyclers!

### ⚪ 5. Residual / Non-Recyclable Waste (Gray / White Bin)
* **Items**: Diapers, sanitary napkins, pet litter, styrofoam, broken ceramics, multi-layered chip packets (metalized plastic).
* **Key Rule**: Non-biodegradable, non-recyclable; sent to sanitary landfills or waste-to-energy plants.

> *Note: Local municipal recycling guidelines can vary by region. Check your local council rules when in doubt.*`,
      source: 'knowledge_fallback',
      categoryTag: 'dry',
    };
  }

  // 6. E-Waste & Electronics
  if (q.includes('battery') || q.includes('e-waste') || q.includes('electronics') || q.includes('phone') || q.includes('charger') || q.includes('cable') || q.includes('laptop')) {
    return {
      reply: `## 🖤 Safe E-Waste & Battery Disposal Protocol

Electronic waste contains valuable elements (gold, silver, copper, rare earth minerals) as well as hazardous toxins (lead, mercury, cadmium, lithium).

### 🔋 Battery Safety Protocols:
1. **Lithium-Ion & Rechargeable Batteries**: 
   * **FIRE HAZARD**: Never throw in normal trash! Compactors can crush them, causing dangerous chemical fires.
   * **Tape the Terminals**: Cover battery contacts with clear scotch tape or electrical tape before dropping them off at recycling collection boxes (found at Best Buy, Home Depot, IKEA, or local libraries).
2. **Single-Use Alkaline (AA, AAA, 9V)**:
   * Many regions now offer dedicated drop-offs. Never incinerate batteries!

### 💻 Old Phones, Laptops & Cables:
* **Factory Reset**: Wipe all personal data, sign out of cloud accounts, and perform a full factory reset.
* **Trade-in / Donate**: If working, donate to schools, charities, or trade in for credit.
* **Certified E-Recycler**: Look for R2 (Responsible Recycling) or e-Stewards certified recycling facilities.

> *Note: Local municipal recycling guidelines can vary by region. Check your local council rules when in doubt.*`,
      source: 'knowledge_fallback',
      categoryTag: 'ewaste',
    };
  }

  // 7. Hazardous Waste (Chemicals, paints, medicines)
  if (q.includes('hazardous') || q.includes('paint') || q.includes('chemical') || q.includes('medicine') || q.includes('poison') || q.includes('pesticide')) {
    return {
      reply: `## 🔴 Domestic Hazardous Waste Protocol

Hazardous items pose immediate threats to sanitation workers, wildlife, and municipal groundwater systems when improperly dumped.

### 🚫 Never Flush or Pour Down the Drain:
* **Expired Medicines**: Flushing antibiotics or pharmaceuticals contaminates drinking water and damages aquatic life. Utilize pharmacy drug take-back boxes or municipal drop boxes.
* **Paints & Solvents**: Oil-based paints are toxic and flammable. Latex paint can often be dried out with cat litter and disposed of as solid waste, but check local rules.
* **Motor Oil & Car Fluids**: One quart of motor oil can foul **250,000 gallons** of drinking water! Take used oil to auto parts retailers or service stations for free recycling.

> *Always store hazardous products in their original labeled containers until you can transport them to a certified municipal hazardous waste facility.*`,
      source: 'knowledge_fallback',
      categoryTag: 'hazardous',
    };
  }

  // 8. Specific tricky items
  if (q.includes('pizza box') || q.includes('coffee cup') || q.includes('styrofoam') || q.includes('foil') || q.includes('bubble wrap') || q.includes('carton')) {
    return {
      reply: `## 🔍 Disposal Guide for Tricky Household Items

### 🍕 Pizza Boxes
* **Greasy / Cheese-Stuck Bottom**: 🟢 **Compost Bin** or ⚪ **Residual Bin**. Oil permanently damages the paper fiber recycling process!
* **Clean Cardboard Top Lid**: Tear off the clean top lid and place it in the 🔵 **Blue Bin (Cardboard)**!

### ☕ Disposable Coffee Cups
* Most paper coffee cups are lined with a hidden thin polyethylene plastic film to prevent leaks. 
* Consequently, 90%+ cannot be recycled in standard paper streams. Place in ⚪ **Residual Bin** or switch to a reusable travel mug!

### 📦 Bubble Wrap & Soft Film Plastics
* **Do NOT put in curb-side recycling bins** — soft plastics jam rotating sorting screens at recycling facilities.
* Drop them off at supermarket plastic bag collection bins along with bread bags and grocery sacks.

### 🥡 Styrofoam (#6 Polystyrene)
* Extremely light, brittle, and not economically viable for standard curb programs. Place in ⚪ **Residual Bin**.

> *Note: Local municipal recycling guidelines can vary by region. Check your local council rules when in doubt.*`,
      source: 'knowledge_fallback',
      categoryTag: 'dry',
    };
  }

  // 9. Eco-friendly habits & General Sustainability
  return {
    reply: `## 🌿 EcoBuddy AI Sustainability Guide

Hello! I am **EcoBuddy AI**, your enthusiastic guide to making daily eco-conscious choices that protect our planet!

### 🌟 4 High-Impact Daily Eco Habits:
1. **The 5 R's of Zero-Waste**:
   * **Refuse** single-use plastics (straws, takeout cutlery, extra bags).
   * **Reduce** unnecessary consumer purchases.
   * **Reuse** glass jars, cloth totes, and durable containers.
   * **Rot** (Compost) food scraps and yard trimmings.
   * **Recycle** only clean, segregated materials as a final step.

2. **Smart Shopping**:
   * Choose products with minimal packaging or made from post-consumer recycled (PCR) content.
   * Buy local and seasonal produce to cut carbon emissions from food transport.

3. **Conserve Energy & Water**:
   * Unplug "vampire electronics" that draw phantom power while on standby.
   * Wash clothes in cold water — 90% of a washing machine's energy goes toward heating the water!

4. **Have a Specific Item to Sort?**
   * Ask me about any object (e.g., *"How do I dispose of old phone chargers?"*, *"Can I compost citrus peels?"*, *"What does plastic code #5 mean?"*) or upload a photo!

> *Note: Local municipal recycling guidelines can vary by region. Check your local council rules when in doubt.*`,
    source: 'knowledge_fallback',
    categoryTag: 'tip',
  };
}
