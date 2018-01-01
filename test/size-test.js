import test from 'ava';
import { FibonacciHeap } from '../';
import testHelper from '@tyriar/heap-tests/size-tests';

testHelper.run(test, FibonacciHeap);
