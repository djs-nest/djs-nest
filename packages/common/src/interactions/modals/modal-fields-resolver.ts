import { APIModalSubmitInteraction, ModalSubmitActionRowComponent, ModalSubmitComponent } from '@discordjs/core';

export class ModalFieldsResolver {
  private readonly components: ModalSubmitActionRowComponent[];
  private readonly fields: Map<string, ModalSubmitComponent>;

  constructor(interaction: APIModalSubmitInteraction) {
    /**
     * The components within the modal
     * @type {ModalSubmitActionRowComponent[]} The components in the modal
     */
    this.components = interaction.data.components;

    /**
     * The extracted fields from the modal
     * @type {Collection<string, ModalSubmitComponent>} The fields in the modal
     */
    this.fields = this.components.reduce((accumulator, next) => {
      next.components.forEach(c => accumulator.set(c.custom_id, c));
      return accumulator;
    }, new Map());
  }

  /**
   * Gets all the fields mapped to custom id
   */
  getFields(): Map<string, ModalSubmitComponent> {
    return this.fields;
  }

  /**
   * Gets a field given a custom id from a component
   * @param {string} customId The custom id of the component
   * @param {boolean} [getFull=true] Whether to get the full option object
   * @returns {ModalSubmitComponent|string}
   */
  getField(customId: string, getFull?: true): ModalSubmitComponent;
  getField(customId: string, getFull: false): string;
  getField(customId: string, getFull = true): ModalSubmitComponent | string {
    const field = this.fields.get(customId);
    if (!field) throw new Error(`Modal Field NotFound: ${customId}`);

    if (getFull) return field;

    return field.value;
  }
}
