import { products } from '@wix/stores'
import { dashboard } from '@wix/dashboard'
import { createClient } from '@wix/sdk'

import pageJson from '../pages/page.json' assert { type: 'json' };

import { isEmpty } from 'lodash'

export function getAppInstance() {
  return new URLSearchParams(window.location.search).get('instance')!
}

export const encodeBase64 = (str: string): string => {
  return encodeURIComponent(btoa(str))
}

export const decodeBase64 = (str: string) => {
  return atob(str)
}

export function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export const fetchAllProducts = async () => {
  const { queryProducts } = products
  const limit = 50 // Number of products per batch
  let offset = 0 // Starting offset
  let fetchedProducts: products.Product[] = [] // To store fetched products

  try {
    while (true) {
      const { items, totalCount = 0 } = await queryProducts().limit(limit).skip(offset).find()

      fetchedProducts = fetchedProducts.concat(items)

      // Break if all products are fetched
      if (offset + limit >= totalCount) {
        break
      }

      offset += limit
    }

    console.log('Total products fetched:', fetchedProducts.length)

    return fetchedProducts // Update the state with all products
  } catch (err) {
    console.error('Error fetching products:', err)
  }
}

export function formatCurrency(value: number = 0, currency: string | undefined = undefined, locale: string = 'en-US') {
  const formatter = new Intl.NumberFormat(locale, {
    style: currency ? 'currency' : 'decimal',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })
  return formatter.format(value)
}

export function getClient() {
  return createClient({
    host: dashboard.host(),
    auth: dashboard.auth(),
    modules: {
      dashboard
    }
  })
}

export function getPageId(): Promise<string> {
  return new Promise((resolve, reject) => {
    try {
      if (pageJson['id']) {
        resolve(pageJson['id'])
      } else {
        reject('Key not found in JSON')
      }
    } catch (error) {
      reject('Error parsing JSON: ' + error)
    }
  })
}

export function isEmptyOrNull(value: unknown) {
  return value == null || isEmpty(value)
}


export function openExternalUrl(url: string) {
  window.open(url, '_blank', 'noopener')
}
