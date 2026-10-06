import { describe, it, expect, beforeEach } from 'vitest';
import { formatDescriptionWithLinks, renderDetailView } from '../../js/ui.js';

describe('formatDescriptionWithLinks & Description Overflow', () => {
  describe('Anti-XSS sanitization', () => {
    it('escapes script tags and html tags like <script>alert("hack")</script>', () => {
      const input = '<script>alert("hack")</script>';
      const result = formatDescriptionWithLinks(input);
      expect(result).toContain('&lt;script&gt;');
      expect(result).toContain('&lt;/script&gt;');
      expect(result).not.toContain('<script>');
    });

    it('escapes formatting tags like <b>negrita</b>', () => {
      const input = '<b>negrita</b>';
      const result = formatDescriptionWithLinks(input);
      expect(result).toBe('&lt;b&gt;negrita&lt;/b&gt;');
      expect(result).not.toContain('<b>');
    });

    it('escapes html entities within URLs or query parameters', () => {
      const input = 'https://example.com/test?x="><script>alert(1)</script>';
      const result = formatDescriptionWithLinks(input);
      expect(result).not.toContain('<script>');
      expect(result).toContain('&lt;script&gt;');
    });
  });

  describe('Autolinking URLs', () => {
    it('converts URLs to secure anchor tags with required attributes', () => {
      const input = 'Bases: https://drive.google.com/file/d/123/view?fbclid=abc en el sitio.';
      const expectedLink = '<a href="https://drive.google.com/file/d/123/view?fbclid=abc" target="_blank" rel="noopener noreferrer" class="text-secondary font-semibold underline hover:opacity-80 break-all">https://drive.google.com/file/d/123/view?fbclid=abc</a>';
      const result = formatDescriptionWithLinks(input);
      expect(result).toBe(`Bases: ${expectedLink} en el sitio.`);
    });

    it('converts multiple http and https URLs in the same text', () => {
      const input = 'Visita http://sitio1.cl y también https://sitio2.cl/info';
      const result = formatDescriptionWithLinks(input);
      expect(result).toContain('href="http://sitio1.cl"');
      expect(result).toContain('href="https://sitio2.cl/info"');
      expect(result).toContain('target="_blank"');
      expect(result).toContain('rel="noopener noreferrer"');
    });
  });

  describe('Falsy and empty values', () => {
    it('returns an empty string when given empty string, null, or undefined', () => {
      expect(formatDescriptionWithLinks('')).toBe('');
      expect(formatDescriptionWithLinks(null)).toBe('');
      expect(formatDescriptionWithLinks(undefined)).toBe('');
    });
  });

  describe('renderDetailView DOM integration and overflow styles', () => {
    let container;

    beforeEach(() => {
      container = document.createElement('div');
      container.id = 'calendar-container';
      document.body.innerHTML = '';
      document.body.appendChild(container);
    });

    it('renders description with autolinks and overflow-wrap classes', () => {
      const mockRace = {
        id: 'race-1',
        name: 'Gravel Desafío',
        discipline: 'Gravel',
        date: '2026-11-15',
        region: 'Metropolitana',
        comuna: 'Pirque',
        description: 'Información en https://carrera.cl/bases con detalles.',
        status: 'Confirmada',
        price: 25000,
        isFree: false
      };

      renderDetailView(container, mockRace, false, null);

      const link = container.querySelector('p a[href="https://carrera.cl/bases"]');
      expect(link).not.toBeNull();
      expect(link.getAttribute('target')).toBe('_blank');
      expect(link.getAttribute('rel')).toBe('noopener noreferrer');
      expect(link.classList.contains('break-all')).toBe(true);

      const descriptionParagraph = link.closest('p');
      expect(descriptionParagraph.className).toContain('break-words');
      expect(descriptionParagraph.className).toContain('[overflow-wrap:anywhere]');

      const descriptionCard = descriptionParagraph.closest('div');
      expect(descriptionCard.className).toContain('break-words');
      expect(descriptionCard.className).toContain('[overflow-wrap:anywhere]');
      expect(descriptionCard.className).toContain('overflow-hidden');
    });
  });
});
