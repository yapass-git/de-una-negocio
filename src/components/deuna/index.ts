/**
 * Deuna Negocios component library — organized following Atomic Design.
 *
 *   atoms/      → AmountText · Avatar · Badge · Button · Divider · Emoji
 *                 IconButton · Input · NumericKey · PercentOption
 *                 ProgressBar · SegmentedOption · SpinnerRing · SuccessCheck
 *   molecules/  → AmountDisplay · BalanceCard · BarChart · Card · NewsCard
 *                 NumericKeypad · PercentGrid · PromoBanner · QuickAction
 *                 ReachCard · SegmentedTabs · SelectableRow
 *   organisms/  → AppBottomNav · BusinessHeader · CobrarPanel · GestionarPanel
 *                 Modal · PromoDiscountModal · SalesStatsModal
 *
 * Edit a token in `globals.css` to change branding globally, an atom to
 * change a primitive (button, chip, key…), a molecule for composition,
 * or an organism for screen-level layout. Nothing cross-depends sideways.
 */

export * from "./atoms";
export * from "./molecules";
export * from "./organisms";
