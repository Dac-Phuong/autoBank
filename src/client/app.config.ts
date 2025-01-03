export default defineAppConfig({
  ui: {
    primary: 'green',
    
    gray: 'zinc',

    icons: {
      dynamic: true
    },

    avatar: {
      rounded: 'rounded-xl'
    },

    button: {
      default: {
        loadingIcon: 'i-bx-loader-alt'
      },
      rounded: 'rounded-xl',
      color: {
        gray: {
          solid: 'ring-0'
        }
      }
    },

    card: {
      base: 'relative overflow-y-auto',
      rounded: 'rounded-xl',
      body: {
        padding: 'px-2 py-2 sm:p-4'
      },
      header: {
        padding: 'px-2 py-2 sm:px-4'
      },
      footer: {
        padding: 'px-2 py-2 pt-0 sm:px-4'
      }
    },

    input: {
      default: {
        color: 'white',
        size: 'lg',
        loadingIcon: 'i-bx-loader-alt',
      },
      border: 'ring-0 bg-gray-100',
      rounded: 'rounded-xl',
      color: {
        gray: {
          outline: 'ring-0'
        }
      }
    },

    alert:{
      variant: {
        soft: 'bg-{color}-500 bg-opacity-10'
      },
      rounded: 'rounded-xl',
    },

    badge: {
      variant: {
        soft: 'bg-{color}-500 bg-opacity-10'
      },
      rounded: 'rounded-xl',
    },

    modal: {
      container: 'items-center',
      overlay: {
        background: 'bg-white/25 dark:bg-black/50 backdrop-blur'
      },
      base: 'overflow-x-hidden overflow-visible',
      rounded: 'rounded-xl',
    },

    slideover: {
      overlay: {
        background: 'bg-white/25 dark:bg-black/50 backdrop-blur'
      }
    },

    notifications: {
      position: 'right-0 top-0 bottom-auto',
    },
    
    notification: {
      background: 'dark:bg-black/50 backdrop-blur',
      progress: {
        base: 'h-0.5'
      }
    },

    formGroup: {
      wrapper: 'mb-4',
      container: 'mt-2'
    },

    table: {
      th: {
        base: 'whitespace-nowrap'
      }
    },

    pagination: {
      wrapper: 'flex items-center gap-1',
      rounded: '!rounded-full min-w-[32px] justify-center'
    },

    select: {
      default: {
        loadingIcon: 'i-bx-loader-alt',
        color: 'white',
        size: 'lg',
        border: 'ring-0 bg-gray-100'
      },
      rounded: 'rounded-xl',
      color: {
        gray: {
          outline: 'ring-0 bg-gray-100'
        }
      }
    },

    textarea: {
      default: {
        color: 'gray',
      },
      rounded: 'rounded-xl',
      color: {
        gray: {
          outline: 'ring-0 bg-gray-100'
        }
      }
    }
  }
})