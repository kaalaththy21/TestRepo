export default class SimpleNavigationHelper {
  constructor(selector, element, scrollSelector) {
    this.selector = selector;
    this.element = element;
    this.scrollSelector = scrollSelector;
    this.element.addEventListener('keydown', this);
    this._mutationObserver = new MutationObserver(this.refresh.bind(this));
    this._mutationObserver.observe(this.element, {
      childList: true,
      subtree: true
    });
    this.element.addEventListener('focus', this);
    this.updateCandidates();
  }

  updateCandidates() {
    this._candidates = Array.from(this.element.querySelectorAll(this.selector));

  }

  refresh(mutations) {
    mutations.forEach(function (mutation) {
      [].slice.call(mutation.removedNodes).forEach((node) => {
        if (node === this._currentFocus) {
          var next = this.findNext(this._currentFocus);
          if (next) {
            this._currentFocus = next;
          } else {
            this._currentFocus = this.element;
          }
          if (document.activeElement === document.body) {
            this.scrollIntoView(this._currentFocus);
            //this.currentFocus.focus();
          }
        } else {
        }
      });
    }, this);

    this.updateCandidates();
    // In case all candidates are removed
    // or in case it's initially empty then add candidates
    if (this.element === document.activeElement) {
      this.setNewFocus();
    } else if (document.body === document.activeElement) {
      // Once there're no candidates and document.activeElement loses,
      // we assume the losing document.activeElement is in our scope due to change this time.
      // So we need to focus back to the root.
      this._currentFocus = this.element;
      this.element.focus();
    }
  }

  handleEvent(evt) {
    if (evt.type === 'keydown') {
      this.onKeyDown(evt);
    } else if (evt.type === 'focus') {
      if (this._currentFocus && this._currentFocus !== this.element) {
        this.scrollIntoView(this._currentFocus);
        this._currentFocus.focus();
        return;
      }
      var next = this.findNext();
      if (next) {
        this.scrollIntoView(next);
        next.focus();
        this._currentFocus = next;
      } else {
        this._currentFocus = this.element;
      }
    }
  }

  onKeyDown(evt) {


    var nextFocus = null;
    var handled = false;
    var key = evt.key || evt.code;
    if (key == 'PageUp') {
      key = 'ArrowUp';
    }
    if (key == 'PageDown') {
      key = 'ArrowDown';
    }
    switch (key) {
      case 'ArrowDown':
        handled = true;
        nextFocus = this.findNext();
        break;
      case 'ArrowUp':
        handled = true;
        nextFocus = this.findPrev();
        break;
    }
    this.nextToFocus(nextFocus);

    if (handled) {
      evt.stopPropagation();
      evt.preventDefault();
    }
  }

  nextToFocus(nextFocus) {
    if (nextFocus) {
      this.scrollIntoView(nextFocus);
      nextFocus.focus();
      this._currentFocus = nextFocus;
    }
  }
  scrollIntoView(element) {
    if (this.scrollSelector) {
      var target = element;
      var found = false;
      while (target !== document.body) {
        if (target.matches(this.scrollSelector)) {
          found = true;
          target.scrollIntoView(false);
          break;
        }
        target = target.parentNode;
      }
      if (!found) {
        // In case the parent does no exist.
        element.scrollIntoView(false);
      }
    } else {
      element.scrollIntoView(false);
    }
  }

  findNext(element) {
    element = element || document.activeElement;
    var candidates = this._candidates;
    if (!candidates.length) {
      return null;
    }
    var next = 0;
    candidates.some(function (dom, index) {
      if (dom === element) {
        next = (index + 1) % candidates.length;
        return true;
      } else {
        return false;
      }
    }, this);
    return candidates[next] || candidates[0];
  }

  findPrev(element) {
    element = element || document.activeElement;
    var candidates = this._candidates;
    if (!candidates.length) {
      return null;
    }
    var next = null;
    candidates.some(function (dom, index) {
      if (dom === element) {
        next = (candidates.length + index - 1) % candidates.length;
        return true;
      } else {
        return false;
      }
    }, this);
    return candidates[next] || candidates[0];
  }
};
